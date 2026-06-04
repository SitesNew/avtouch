<?php
/*
 Код вызова ссылок SetLinks.ru.
 Основной класс.
 Версия 3.0.8.
*/
require_once(dirname(__FILE__)."/slconfig.php");

class SLClient
{
    // внутренние переменные
    var $Config;
    var $links = false;
    var $curlink = 0;
    var $servercachetime = 0;
    var $cachetime = 0;
    var $errortime = 0;
    var $delimiter = '';
    var $uri = false;
    var $host = '';
    
    
    
    function SLClient($uri='') 
    {   
        $this->Config = new SLConfig();
        
        if(!empty($uri)) 
            $this->uri = $uri;
        else
            $this->uri = (isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : $HTTP_SERVER_VARS['REQUEST_URI']);
        
        if (strlen(session_id()) > 0) {
            $session = session_name()."=".session_id();
            $this->uri = str_replace(array('?'.$session,'&'.$session), '', $this->uri);
        } 
            
        if(empty($this->uri) || (!empty($this->Config->indexfile) && preg_match("!".$this->Config->indexfile."!", $this->uri))) 
            $this->uri = '/';
                   
        if($this->Config->connecttype == 'CURL' AND !function_exists('curl_init')) $this->Error('CURL not found! Библиотека CURL не обнаружена!');
        else if($this->Config->connecttype == 'SOCKET' AND !function_exists('fsockopen')) $this->Error('fsockopen not found! Внешние соединения не поддерживаются Вашим хостингом!');
        else if($this->Config->connecttype == 'NONE');
        else {
            if(function_exists('curl_init')) $this->Config->connecttype = 'CURL';
            else if(function_exists('fsockopen')) $this->Config->connecttype = 'SOCKET';
            else $this->Config->connecttype = 'NONE';
        }  
        $this->host = $_SERVER['HTTP_HOST'];
        if(substr($this->host,0,4) == 'www.') 
            $this->host = substr($this->host, 4);  
        if(isset($this->Config->aliases[$this->host]))
            $this->host = $this->Config->aliases[$this->host];
        if(empty($this->Config->cachedir))
            $this->Config->cachedir = dirname(__FILE__)."/cache/";
        if(!is_dir($this->Config->cachedir))
            $this->Error("Can't open cache dir!"); 
        else if(!is_writable($this->Config->cachedir))
            $this->Error("Cache dir: Permission denied!"); 
            
        if(empty($this->cachefile))
            $this->cachefile = $this->host.'.links';
    }
    
    function SaveLinksToCache($links, $info)
    {       
        if(count($info)!=4) return false;
        unset($info[1]);
        if($this->Config->cachetype == "MYSQL") {            
            mysql_query("replace into sl_params values 
                ('".$this->host."_lcc', '".time()."'), 
                ('".$this->host."_scc', '".intval($info[0])."'), 
                ('".$this->host."_delim', '".$this->MysqlEscapeString($info[2])."'), 
                ('".$this->host."_sid', '".intval($info[3])."')") or $this->Error(mysql_error());                
            mysql_query("delete from sl_cache where sid='".intval($info[3])."'") or $this->Error(mysql_error());                
            foreach($links AS $val) {
                if(count($val) > 1) {
                    $id = $val[0];
                    unset($val[0]);
                    mysql_query("replace into sl_cache values (".intval($info[3]).", '".$this->MysqlEscapeString($id)."', '".$this->MysqlEscapeString(implode("\t", $val))."')") or $this->Error(mysql_error());                
                }
            }               
            return true;         
        } else if($this->Config->cachetype == "FILE") {            
            $h = @fopen($this->Config->cachedir.$this->cachefile, "w+");                        
            if($h) {
                $info[4] = "0000000000";
                @fwrite($h, time()."\t".implode("\t", $info)."\n");                                
                foreach($links AS $val) {
                    if(count($val)>1)
                        @fwrite($h, implode("\t", $val)."\n");                
                }
                @fclose($h);            
                return true;
            } else $this->Error('Can\'t open cache file!');
        } else $this->Error("Cache type unknown!");                
        return false;
    }
    
    function IsCached()
    {
        if($this->Config->cachetype == "MYSQL") {
            $res = @mysql_query("select param_name, param_value from sl_params where param_name like '".$this->host."\\_%'") or $this->Error(mysql_error());
            while($line = mysql_fetch_assoc($res)) {
                if($line['param_name'] == $this->host."_scc") 
                    $this->servercachetime = $line['param_value'];
                else if($line['param_name'] == $this->host."_lcc") 
                    $this->cachetime = min(time()+24*60*60, $line['param_value']);
                else if($line['param_name'] == $this->host."_delim") 
                    $this->delimiter = $line['param_value'];                
                else if($line['param_name'] == $this->host."_errtime") 
                    $this->errortime = $line['param_value'];                    
            }
        } else if($this->Config->cachetype == "FILE") {
            if(!is_file($this->Config->cachedir.$this->cachefile)) return false;
            $h = @fopen($this->Config->cachedir.$this->cachefile, "r");                        
            if($h) {
                $info = explode("\t", @fgets($h));
                $this->cachetime = min(time()+24*60*60, $info[0]);
                $this->servercachetime = $info[1];
                $this->delimiter = $info[2];                
                $this->errortime = $info[4];
                @fclose($h);            
            }
        }
        
        if( ($this->cachetime + $this->Config->cachetimeout > time()) || ($this->errortime + $this->Config->errortimeout > time()) )
            return true;
        return false;
        
    }
    
    function GetLinks($countlinks=0, $delimiter=false)
    {      
        static $firstlink=true;                
        
        if(!$this->IsCached()) {             
            if(!$this->DownloadLinks()) {
                if($this->Config->cachetype == "MYSQL") {
                    mysql_query("replace into sl_params values ('".$this->host."_errtime', '".time()."')") or $this->Error(mysql_error());
                } else if($this->Config->cachetype == "FILE" && file_exists($this->Config->cachedir.$this->cachefile)) {
                    $h = fopen($this->Config->cachedir.$this->cachefile, "r+");
                    if($h) {
                        $str = fgets($h);
                        if(strlen($str) > 25) {
                            fseek($h, strlen($str)-11);
                            fwrite($h, time());
                        }
                        fclose($h);
                    }
                }  
            }
        }
        
               
        $pageid = sprintf("%u", crc32($this->host . $this->uri));                
        if($this->links === false) {
            if($this->Config->cachetype == "MYSQL") {
                $res = mysql_query("select param_value from sl_params where param_name='".$this->host."_delim'") or $this->Error(mysql_error());
                $line = mysql_fetch_assoc($res);
                $this->delimiter = $line['param_value'];
                $res = mysql_query("select param_value from sl_params where param_name='".$this->host."_sid'") or $this->Error(mysql_error());                
                $sid = mysql_fetch_assoc($res);
                $res = mysql_query("select links from sl_cache where sid='".intval($sid['param_value'])."' and id='".$this->MysqlEscapeString($pageid)."'") or $this->Error(mysql_error());
                if(mysql_num_rows($res) == 1) {
                    $this->links = mysql_fetch_assoc($res);
                    $this->links = explode("\t", $this->links['links']);
                } else {
                    $this->links = Array();
                }
            } else if($this->Config->cachetype == "FILE") {
                $h = @fopen($this->Config->cachedir.$this->cachefile, "r");                        
                if($h) {                    
                    $info = explode("\t", @fgets($h));
                    $this->servercachetime = $info[0];
                    $this->cachetime = $info[1];
                    $this->delimiter = $info[2];
                    $this->links = Array();
                    while(!feof($h)) {                        
                        $links = explode("\t", @fgets($h));
                        if($links[0] == $pageid) {
                            unset($links[0]);
                            $this->links = array_values($links);
                        }
                    }
                    @fclose($h);            
                }
            }
        }
        
        $returnlinks = Array();
        $cnt = count($this->links);
        if($countlinks > 0) $cnt = min($cnt, $this->curlink+$countlinks);
        for(; $this->curlink < $cnt; $this->curlink++) {
            $returnlinks[] = $this->links[$this->curlink];
        }
        $retstring = ($firstlink ? '<!--'.substr($this->Config->password, 0, 5).'-->' : '').implode(($delimiter===false ? $this->delimiter : $delimiter), $returnlinks);
        $firstlink = false;
        
        return $retstring;
    }
    
    function DownloadLinks()
    {
        $page = '';
        $path = "/?host=".$this->host."&k=".$this->Config->encoding."&p=".$this->Config->password;
        if($this->Config->connecttype == "CURL") {
            $curl = curl_init($this->Config->server.$path);
            curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, $this->Config->sockettimeout);
            curl_setopt($curl, CURLOPT_TIMEOUT, $this->Config->sockettimeout);
            curl_setopt($curl, CURLOPT_HEADER, false);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            
            $page = curl_exec($curl);
            if(curl_error($curl) OR curl_getinfo($curl, CURLINFO_HTTP_CODE) != '200')
            {
                curl_close($curl);
                return false;
            }
            curl_close($curl); 
                       
        } else if($this->Config->connecttype == "SOCKET") {
            $fp = @fsockopen($this->Config->server, 80);
            if(!$fp) {
                return false;
            } else {
                fputs($fp,"GET ".$path.
                  " HTTP/1.0\r\nHost: ".$this->Config->server."\r\nConnection: Close\r\n\r\n");
                socket_set_timeout($fp, $this->Config->sockettimeout);
                $page = '';
                while(!feof($fp)){
                   $page .= fread($fp, 2048);
                }
                $status = socket_get_status($fp);
                fclose($fp);
                if($status['unread_bytes'] == 0 && $status['timed_out'] != 1) {
                    $page = substr($page, strpos($page,"\r\n\r\n")+4);
                } else return false;
            }
        } else return false;  
        $page = trim($page);
        if(strlen($page) < 20) return false;
        $this->SaveLinks($page);
        return true;
    }
    
    function SaveLinks($page)
    {    
        $info = explode("\t", substr($page, 0, strpos($page,"\n")));        
        if($this->Config->password == $info[1]) {
            $this->servercachetime = $info[0];
            $this->cachetime = time();
            $this->delimiter = $info[2];        
            $this->errortime = 0;
            $page = explode("\n", substr($page, strpos($page,"\n")+1));
             
            foreach($page as $key=>$val)
                $page[$key] = explode("\t", $val); 
            
            if(!$this->SaveLinksToCache($page, $info)) $this->Error('Can\'t write cache!');
            else return true;
        } else 
            $this->Error('Incorrect password!');  
        return false;        
    }
    
    function MysqlEscapeString($string) 
    {
        if(get_magic_quotes_gpc())
            $string = stripslashes($string);
        if(function_exists('mysql_real_escape_string'))
            return mysql_real_escape_string($string);
        return mysql_escape_string($string);
    }
    
    function SetCursorPosition($position)
    {
        $this->curlink = max(intval($position)-1, 0);
    }
    
    function Error($error)
    {
        print('<font color="red">SetLinks error: '.$error." </font><br>\n");
    }
}

?>
