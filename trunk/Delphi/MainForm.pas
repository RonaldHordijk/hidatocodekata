unit MainForm;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, Map, StdCtrls, Generics.Collections;

type
  TForm4 = class(TForm)
    lbJumps: TListBox;
    btnsolve: TButton;
    btnAll: TButton;
    Button1: TButton;
    procedure FormCreate(Sender: TObject);
    procedure FormPaint(Sender: TObject);
    procedure lbJumpsClick(Sender: TObject);
    procedure btnsolveClick(Sender: TObject);
    procedure lbJumpsDblClick(Sender: TObject);
    procedure btnAllClick(Sender: TObject);
    procedure Button1Click(Sender: TObject);
  private
    AllMaps: TObjectList<TMap>;
    AMIndex: Integer;

    FMap: TMap;

    function GetDrawRect(const CellX, CellY: Integer): TRect;
    procedure Deflate(var ARect: TRect; Size: integer);
  public
  end;

var
  Form4: TForm4;

implementation

{$R *.dfm}

uses
  mmsystem;

procedure TForm4.btnAllClick(Sender: TObject);
var
  i: integer;
  SearchRec:TSearchRec;
  Status: integer;
  newMap: TMap;
  start: Cardinal;
begin
  Status := FindFirst('data\hida*.xml', faAnyFile, SearchRec);
  try
    while Status = 0 do
    begin
      newMap := TMap.FromFile('data\' + SearchRec.Name);
      if assigned(newMap) then
        AllMaps.Add(newMap);

      Status := FindNext(SearchRec);
    end;
  finally
    FindClose(SearchRec);
  end;

  start := timeGetTime;
  for i := 0 to AllMaps.Count - 1 do
  begin
    if not AllMaps[i].TrySolve then
      ShowMessage('Not Solved ' + Inttostr(i));
  end;

  ShowMessage(format('Elapsed %.3f', [0.001*(timeGetTime - Start)]));

end;

procedure TForm4.btnsolveClick(Sender: TObject);
var
  Jump: TJump;
  i: integer;
  prefix: string;
begin
  if lbJumps.ItemIndex < 0 then
    Exit;

  Jump := FMap.JumpList[lbJumps.ItemIndex];
  FMap.Solve(Jump);

//  FMap.CreateWorkMap;
  FMap.SolveJumps(Jump);
  FMap.CheckCoverage;

  lbJumps.Items.Clear;
  for i := 0 to FMap.JumpList.Count - 1 do
  begin
    case FMap.Jumplist[i].GetState of
    jsSolved: prefix := 'S';
    jsOneSol:  prefix := '1';
    jsPartial:  prefix := 'P';
    jsNoSol:  prefix := 'N';
    end;

    lbJumps.Items.Add(prefix +' ' + IntToStr(FMap.JumpList[i].PointLow.V) + ' -> ' + IntToStr(FMap.JumpList[i].PointHigh.V));
  end;

  invalidate
end;

procedure TForm4.Button1Click(Sender: TObject);
var
  i: integer;
  prefix: string;
begin
  FMap := AllMaps[AMIndex];

//  FMap.BuildJumps;
//  FMap.CreateWorkMap;
//  FMap.SolveJumps(nil);
//  FMap.CheckCoverage;

  lbJumps.Items.Clear;
  for i := 0 to FMap.JumpList.Count - 1 do
  begin
    case FMap.Jumplist[i].GetState of
    jsSolved: prefix := 'S';
    jsOneSol:  prefix := '1';
    jsPartial:  prefix := 'P';
    jsNoSol:  prefix := 'N';
    end;

    lbJumps.Items.Add(prefix +' ' + IntToStr(FMap.JumpList[i].PointLow.V) + ' -> ' + IntToStr(FMap.JumpList[i].PointHigh.V));
  end;

  invalidate;

  AMIndex := AMIndex + 1;
end;

procedure TForm4.Deflate(var ARect: TRect; Size: integer);
begin
  ARect.Left := ARect.Left + Size;
  ARect.Top := ARect.Top + Size;
  ARect.Bottom := ARect.Bottom - Size;
  ARect.Right := ARect.Right - Size;
end;

procedure TForm4.FormCreate(Sender: TObject);
var
  i: integer;
  prefix: string;
begin
  // 1 solved
  // 2 solved
  // 3 solved
  // 4 solved
  // 5 solved
  // 6 solved

  AllMaps := TObjectList<TMap>.Create;

  FMap := TMap.FromString(test4);
  FMap.BuildJumps;
  FMap.CreateWorkMap;
  FMap.SolveJumps;
  FMap.CheckCoverage;
  FMap.SolveJumps;

  for i := 0 to FMap.JumpList.Count - 1 do
  begin
    case FMap.Jumplist[i].GetState of
    jsSolved: prefix := 'S';
    jsOneSol:  prefix := '1';
    jsPartial:  prefix := 'P';
    jsNoSol:  prefix := 'N';
    end;

    lbJumps.Items.Add(prefix +' ' + IntToStr(FMap.JumpList[i].PointLow.V) + ' -> ' + IntToStr(FMap.JumpList[i].PointHigh.V));
  end;
end;

procedure TForm4.FormPaint(Sender: TObject);
const
  CELLWIDTH = 30;
  CELLHEIGHT = 30;
var
  i, j: integer;
  ARect: TRect;
  S: string;
  Jump: TJump;
begin
  Canvas.Pen.Color := clBlack;
  Canvas.Pen.Width := 1;

  // border
  Canvas.Pen.Width := 2;
  Canvas.Pen.Color := clBlack;
  ARect := GetDrawRect(0, 0);
  Canvas.MoveTo(ARect.Left, ARect.Top);
  ARect := GetDrawRect(0, FMap.Height);
  Canvas.LineTo(ARect.Left, ARect.Top);
  ARect := GetDrawRect(FMap.Width, FMap.Height);
  Canvas.LineTo(ARect.Left, ARect.Top);
  ARect := GetDrawRect(FMap.Width, 0);
  Canvas.LineTo(ARect.Left, ARect.Top);
  ARect := GetDrawRect(0, 0);
  Canvas.LineTo(ARect.Left, ARect.Top);

  // lines
  Canvas.Pen.Width := 1;
  for i := 0 to FMap.Width do
  begin
    ARect := GetDrawRect(i, 0);
    Canvas.MoveTo(ARect.Left, ARect.Top);
    ARect := GetDrawRect(i, FMap.Height);
    Canvas.LineTo(ARect.Left, ARect.Top);
  end;

  for i := 0 to FMap.Height do
  begin
    ARect := GetDrawRect(0, i);
    Canvas.MoveTo(ARect.Left, ARect.Top);
    ARect := GetDrawRect(FMap.Width, i);
    Canvas.LineTo(ARect.Left, ARect.Top);
  end;


  // selection
  if lbJumps.ItemIndex >= 0 then begin

    Canvas.Pen.Color := clLime;
    Canvas.Brush.Color := clLime;
    Jump := FMap.JumpList[lbJumps.ItemIndex];
    for i := 0 to Jump.Steps.Count - 1 do
      for j := 0 to jump.Steps[i].Count - 1 do
      begin
        ARect := GetDrawRect(jump.Steps[i][j].X, jump.Steps[i][j].Y);
        Deflate(ARect,2);
        Canvas.FillRect(ARect);
      end;
    Canvas.Brush.Color := clBtnFace;

    Canvas.Pen.Color := clred;
    Canvas.Pen.Width := 2;

    Jump := FMap.JumpList[lbJumps.ItemIndex];
    ARect := GetDrawRect(Jump.PointLow.X, Jump.PointLow.Y);
    Deflate(ARect,2);
    Canvas.Ellipse(ARect);

    ARect := GetDrawRect(Jump.PointHigh.X, Jump.PointHigh.Y);
    Deflate(ARect,2);
    Canvas.Ellipse(ARect);
  end;

  //coverage
  for i := 0 to FMap.Width - 1 do
  begin
    for j := 0 to FMap.Height - 1 do
    begin
      if FMap.CoverageMap[i,j] > 0 then
      begin
        Canvas.Font.Name := 'Arial';
        Canvas.Font.Style := [fsBold];
        Canvas.Font.Size := 6;
        Canvas.Font.Color := clRed;

        ARect := GetDrawRect(i,j);
        Deflate(ARect,2);
        S := IntToStr(FMap.CoverageMap[i,j]);
        Canvas.TextRect(ARect, S, [tfBottom, tfSingleLine, tfLeft]);
      end;
    end;
  end;

  // numbers
  Canvas.Pen.Width := 1;
  for i := 0 to FMap.Width - 1 do
  begin
    for j := 0 to FMap.Height - 1 do
    begin
      if FMap.StartMap[i,j] < 0 then
      begin
        Canvas.Brush.Color := clBlack;
        ARect := GetDrawRect(i,j);
        Canvas.FillRect(ARect);
        Canvas.Brush.Color := clBtnFace;
      end
      else
      if FMap.WorkMap[i,j] > 0 then
      begin
        Canvas.Font.Name := 'Arial';
        Canvas.Font.Style := [fsBold];
        Canvas.Font.Size := 10;

        if FMap.WorkMap[i,j] <> FMap.StartMap[i,j] then
          Canvas.Font.Color := clblue
        else
          Canvas.Font.Color := clBlack;


        ARect := GetDrawRect(i,j);
        S := IntToStr(FMap.WorkMap[i,j]);
        Canvas.TextRect(ARect, S, [tfCenter, tfSingleLine, tfVerticalCenter]);
      end;
    end;
  end;

end;

function TForm4.GetDrawRect(const CellX, CellY: Integer): TRect;
const
  CELLWIDTH = 30;
  CELLHEIGHT = 30;
begin
  Result := Rect(10 + CellX * CELLWIDTH, 10 + CellY * CELLHEIGHT,
                 10 + (CellX + 1) * CELLWIDTH, 10 + (CellY + 1) * CELLHEIGHT);
end;

procedure TForm4.lbJumpsClick(Sender: TObject);
begin
  Self.Repaint;
end;

procedure TForm4.lbJumpsDblClick(Sender: TObject);
begin
  btnsolveClick(Sender);
end;

end.
