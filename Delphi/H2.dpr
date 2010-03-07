program H2;

uses
  Forms,
  MainformBuilder in 'MainformBuilder.pas' {FormBuilder},
  MapBuilder in 'MapBuilder.pas';

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TFormBuilder, FormBuilder);
  Application.Run;
end.
