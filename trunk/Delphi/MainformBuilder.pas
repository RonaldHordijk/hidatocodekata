unit MainformBuilder;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, MapBuilder, StdCtrls, Map;

type
  TFormBuilder = class(TForm)
    Button1: TButton;
    Button2: TButton;
    Button3: TButton;
    Button4: TButton;
    Button5: TButton;
    Button6: TButton;
    Button7: TButton;
    Button8: TButton;
    Button9: TButton;
    lbJumps: TListBox;
    btnsolve: TButton;
    procedure FormCreate(Sender: TObject);
    procedure FormPaint(Sender: TObject);
    procedure Button1Click(Sender: TObject);
    procedure Button2Click(Sender: TObject);
    procedure Button3Click(Sender: TObject);
    procedure Button4Click(Sender: TObject);
    procedure Button5Click(Sender: TObject);
    procedure Button6Click(Sender: TObject);
    procedure Button7Click(Sender: TObject);
    procedure Button8Click(Sender: TObject);
    procedure Button9Click(Sender: TObject);
    procedure btnsolveClick(Sender: TObject);
    procedure lbJumpsDblClick(Sender: TObject);
    procedure lbJumpsClick(Sender: TObject);
  private
    FMapBuilder: TMapBuilder;
    FMap: TMap;

    procedure NewMap;

    function GetDrawRect(const CellX, CellY: Integer): TRect;
    procedure Deflate(var ARect: TRect; Size: integer);
  public
  end;

var
  FormBuilder: TFormBuilder;

implementation

{$R *.dfm}

procedure TFormBuilder.btnsolveClick(Sender: TObject);
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

procedure TFormBuilder.Button1Click(Sender: TObject);
begin
  FMapBuilder.Free;
  FMapBuilder := TMapBuilder.Create(5);
  FMapBuilder.Generate;
  NewMap;
end;

procedure TFormBuilder.Button2Click(Sender: TObject);
begin
  FMapBuilder.Free;
  FMapBuilder := TMapBuilder.Create(6);
  FMapBuilder.Generate;
  NewMap;
end;

procedure TFormBuilder.Button3Click(Sender: TObject);
begin
  FMapBuilder.Free;
  FMapBuilder := TMapBuilder.Create(7);
  FMapBuilder.Generate;
  NewMap;
end;

procedure TFormBuilder.Button4Click(Sender: TObject);
begin
  FMapBuilder.Free;
  FMapBuilder := TMapBuilder.Create(8);
  FMapBuilder.Generate;
  NewMap;
end;

procedure TFormBuilder.Button5Click(Sender: TObject);
begin
  FMapBuilder.Free;
  FMapBuilder := TMapBuilder.Create(9);
  FMapBuilder.Generate;
  NewMap;
end;

procedure TFormBuilder.Button6Click(Sender: TObject);
begin
  FMapBuilder.Free;
  FMapBuilder := TMapBuilder.Create(10);
  FMapBuilder.Generate;
  NewMap;
end;

procedure TFormBuilder.Button7Click(Sender: TObject);
begin
  FMapBuilder.Free;
  FMapBuilder := TMapBuilder.Create(11);
  FMapBuilder.Generate;
  NewMap;
end;

procedure TFormBuilder.Button8Click(Sender: TObject);
begin
  FMapBuilder.Free;
  FMapBuilder := TMapBuilder.Create(12);
  FMapBuilder.Generate;
  NewMap;
end;

procedure TFormBuilder.Button9Click(Sender: TObject);
var
  i, j: Integer;
  dx, dy: integer;
  bkuvalue: integer;
  Prefix: string;
begin
  for i := 0 to 4 do
  begin
    for j := 0 to 100 do
    begin
      dx := Random(FMap.Width);
      dy := Random(FMap.Width);
      if FMap.StartMap[dx,dy] > 2 then
        BREAK;

    end;

    if FMap.StartMap[dx,dy] > 2 then
    begin
      bkuvalue := FMap.StartMap[dx,dy];
      FMap.StartMap[dx,dy] := 0;
      if not FMap.TrySolve then
        FMap.StartMap[dx,dy] := bkuvalue;
    end;
  end;

  FMap.BuildJumps;
  FMap.CreateWorkMap;
  FMap.SolveJumps();

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

end;

procedure TFormBuilder.Deflate(var ARect: TRect; Size: integer);
begin
  ARect.Left := ARect.Left + Size;
  ARect.Top := ARect.Top + Size;
  ARect.Bottom := ARect.Bottom - Size;
  ARect.Right := ARect.Right - Size;
end;

procedure TFormBuilder.FormCreate(Sender: TObject);
begin
  FMapBuilder := TMapBuilder.Create(5);
  FMapBuilder.Generate;
  NewMap;
end;

procedure TFormBuilder.FormPaint(Sender: TObject);
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

function TFormBuilder.GetDrawRect(const CellX, CellY: Integer): TRect;
const
  CELLWIDTH = 30;
  CELLHEIGHT = 30;
begin
  Result := Rect(10 + CellX * CELLWIDTH, 10 + CellY * CELLHEIGHT,
                 10 + (CellX + 1) * CELLWIDTH, 10 + (CellY + 1) * CELLHEIGHT);
end;

procedure TFormBuilder.lbJumpsClick(Sender: TObject);
begin
  Repaint;
end;

procedure TFormBuilder.lbJumpsDblClick(Sender: TObject);
begin
  btnsolveClick(Sender);
end;

procedure TFormBuilder.NewMap;
var
  x, y: integer;
  i: integer;
  prefix: string;
begin
  FMap := TMap.Create(FMapBuilder.Width, FMapBuilder.Height);

  for x := 0 to FMap.Width - 1 do
  begin
    for y := 0 to FMap.Height - 1 do
    begin
      FMap.StartMap[x,y] := FMapBuilder.Map[x,y]
    end;
  end;

  FMap.BuildJumps;
  FMap.CreateWorkMap;
//  FMap.SolveJumps;
//  FMap.CheckCoverage;
//  FMap.SolveJumps;

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

  Invalidate;
end;

end.
