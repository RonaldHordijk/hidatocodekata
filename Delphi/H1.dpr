program H1;

uses
  Forms,
  MainForm in 'MainForm.pas' {Form4},
  Map in 'Map.pas',
  IntegerList in 'IntegerList.pas';

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TForm4, Form4);
  Application.Run;
end.
