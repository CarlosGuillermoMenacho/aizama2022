<?php
class Numbers_Words
{
    function toWords($num, $locale = 'en_US') {

        include_once("Words/lang.${locale}.php");

        $classname = "Numbers_Words_${locale}";

        if (!class_exists($classname)) {
            return Numbers_Words::raiseError("Unable to include the Numbers/Words/lang.${locale}.php file");
        }

        $methods = get_class_methods($classname);

        if (!in_array('toWords', $methods) && !in_array('towords', $methods)) {
            return Numbers_Words::raiseError("Unable to find toWords method in '$classname' class");
        }

        @$obj = new $classname;

        return trim($obj->toWords($num));
    }
       function toCurrency($num, $locale = 'en_US', $int_curr = '') {
        $ret = $num;

        @include_once("Numbers/Words/lang.${locale}.php");

        $classname = "Numbers_Words_${locale}";

        if (!class_exists($classname)) {
            return Numbers_Words::raiseError("Unable to include the Numbers/Words/lang.${locale}.php file");
        }

        $methods = get_class_methods($classname);

        if (!in_array('toCurrencyWords', $methods) && !in_array('tocurrencywords', $methods)) {
            return Numbers_Words::raiseError("Unable to find toCurrencyWords method in '$classname' class");
        }

        @$obj = new $classname;

        if (strpos($num, '.') === false)
        {
          $ret      = trim($obj->toCurrencyWords($int_curr, $num));
        } else {
            $currency = explode('.', $num, 2);
            /* add leading zero */
            if (strlen($currency[1]) == 1) {
                $currency[1] .= '0';
            }
            $ret      = trim($obj->toCurrencyWords($int_curr, $currency[0], $currency[1]));
        }
        return $ret;
    }
   
    function getLocales($locale = null) {
        $ret = array();
       	if (isset($locale) && is_string($locale)) {
       	    $locale = array($locale);
        }
        $dname = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'Words' . DIRECTORY_SEPARATOR;
        $dh=opendir($dname);
        if ($dh) {
            while ($fname = readdir($dh)) {
                if (preg_match('#^lang\.([a-z_]+)\.php$#i', $fname, $matches)) {
                    if (is_file($dname . $fname) && is_readable($dname . $fname) &&
                        (!isset($locale) || in_array($matches[1], $locale))) {
                        $ret[] = $matches[1];
                    }
                }
            }
            closedir($dh);
            sort($ret);
        }
        return $ret;
    }
    
    function raiseError($msg)
    {
        include_once('PEAR.php');
        return PEAR::raiseError($msg);
    }
   }
?>
