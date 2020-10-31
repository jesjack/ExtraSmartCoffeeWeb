<?php

/**
 * Clase que usa el api de http://es.wikiquote.org para obtener la frase de ma semana
 * */
class Frases
{
static private $instancia = NULL;
 
	private function __construct(){}    
 
    static public function getInstancia() 
    {
       if (self::$instancia == NULL) {
          self::$instancia = new Frases ();
       }
       return self::$instancia;
    }
 
	function semana($semana = '')
	{		
		if($semana == '')
			$semana 		= date("D");
 
		$semanaArray 	= array( "Mon" => "lunes", "Tue" => "martes", "Wed" => "miércoles", "Thu" => "jueves", "Fri" => "viernes", "Sat" => "sábado", "Sun" => "domingo", ); 
		$title		= "Plantilla:Frase-".$semanaArray[$semana];
		$title		= "{"."{".$title."}"."}";		
		$sock 		= $this->get("http://es.wikiquote.org/w/api.php?action=parse&format=php&text=$title");
		$array__ 	= unserialize(($sock));
		$texto_final	= $array__["parse"]["text"]["*"];
		$texto_final	= utf8_decode( $texto_final);                       
		$texto_final 	= strip_tags($texto_final);
		$data = explode("n",$texto_final);
		foreach($data as $key => $val)
		{
			if(trim($val) != '')
				$frase[]=$val;
		}
		return $frase;
	}
 
	function get($URL)
	{
		$userAgent 	= 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)';	
		$ch 		= curl_init(); //Set curl to return the data instead of printing it to the browse
		curl_setopt($ch, CURLOPT_USERAGENT, $userAgent); 
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //Set the URL 
		curl_setopt($ch, CURLOPT_URL, $URL); //Execute the fetch 
		$data 		= curl_exec($ch); //Close the connection curl_close($ch);
		return $data;
	}
}

?>