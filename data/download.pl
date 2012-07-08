use LWP::Simple;
use LWP::UserAgent;

$ua = new LWP::UserAgent;
$ua->agent("AgentName/0.1 " . $ua->agent);

for ($i = 12; $i > 0 ; $i--) {
  for ($j = 12; $j > 0 ; $j--) {
    for ($k = 31; $k > 0 ; $k--) {
	  my $filename = "hida";
	  if ($i > 9) {
		$filename .= $i;
	  } else {
		$filename .= '0' . $i;
	  }

	  if ($j > 9) {
		$filename .= $j;
	  } else {
		$filename .= '0' . $j;
	  }

	  if ($k > 9) {
		$filename .= $k;
	  } else {
		$filename .= '0' . $k;
	  }

	  $filename .= '-data.xml';
          if (-e $filename) {
            die;
          }
	  
	  $ress = '';
	  print "retrieving $filename...";
	  getstore("http://www.uclick.com/puzzles/hida/hida_Puzzles/$filename", "$filename");
	  print " Done\n";
    }
  }
}


