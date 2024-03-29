use strict;
use Win32;

my $Line;
my $jsLine;
my @Lines;
my @jsLines;
my $firstjs = 0;
my $jsfile;
my @lintfiles;

open(THEFILE, "Main.html") or die "Can't open file: $!";
  @Lines = <THEFILE>;
close(THEFILE);

chomp @Lines;

system("echo lint results >> alllints.txt");

foreach $jsfile (<test\\test*.js>) {
  push(@lintfiles, $jsfile);
}

foreach $Line (@Lines) {
#lib js
  if (!($Line =~ m#(^.*<script.*\/lib\/.*)(\.js.*$)#i)) {
#js   
    if ($Line =~ m#^.*<script.*"(.*.js).*$#i) {
	  $jsfile = $1;
	  $jsfile =~ s#\/#\\#g;
	  push(@lintfiles, $jsfile);
	 }
  }	 
}	 
foreach $jsfile (@lintfiles) {
   print "\n$jsfile";
	  
#	  system("echo $jsfile >> alllints.txt");
	  
# rename jslint flags
  open(THEFILE, "$jsfile") or die "Can't open file: $!";
  @jsLines = <THEFILE>;
  close(THEFILE); 
  
  @jsLines[0] =~ s#nomen: false#nomen: true#gi;
  @jsLines[0] =~ s#plusplus: false#plusplus: true#gi;
  @jsLines[0] =~ s#regexp: false#regexp: true#gi;
  
  open (TXTFILE, "> lintfile.js");
  print TXTFILE @jsLines;
      close(TXTFILE);
	  
  system("tools\\phantomjs.exe tools\\fulljslint.js lintfile.js > lints.txt");
#  system("java -jar tools\\rhino.jar tools\\fulljslint.js lintfile.js > lints.txt");
#	  system("java -jar tools\\jslint4java-2.0.0.jar $jsfile >> alllints.txt");
	  
  if (!(-z "lints.txt")) {
	print " *";
	
	system("echo $jsfile >> alllints.txt");
	system("type lints.txt >> alllints.txt");
  }	
	  
} 
