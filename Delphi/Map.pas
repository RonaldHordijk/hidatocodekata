unit Map;

interface

uses
  Generics.Collections;

const
  test1: string =
'XX .. .. .. .. .. XX' + #13#10 +
'.. 39 45 15 .. .. 34' + #13#10 +
'.. 44 10 14 17 .. 32' + #13#10 +
'.. .. .. 12 .. 19 ..' + #13#10 +
'.. 04 01 .. .. .. ..' + #13#10 +
'05 .. .. 28 .. 22 ..' + #13#10 +
'XX .. .. 26 24 .. XX';

  test2: string =
'.. .. 08 .. .. .. .. 49' + #13#10 +
'.. 01 06 09 44 45 .. ..' + #13#10 +
'.. .. .. .. 42 51 .. ..' + #13#10 +
'.. .. 12 XX XX .. 39 ..' + #13#10 +
'.. 15 13 XX XX .. .. 38' + #13#10 +
'.. 19 27 28 .. .. .. ..' + #13#10 +
'21 .. 25 .. 29 34 59 ..' + #13#10 +
'.. .. .. .. .. .. .. 60';

  test3: string =
'XX 64 XX 61 XX .. XX .. XX' + #13#10 +
'65 .. .. .. .. .. 50 49 ..' + #13#10 +
'XX .. 11 .. .. 52 .. .. XX' + #13#10 +
'.. 08 .. 12 53 .. .. .. 45' + #13#10 +
'XX 07 16 .. 24 .. .. 43 XX' + #13#10 +
'05 .. .. .. 25 32 .. .. ..' + #13#10 +
'XX .. .. 22 .. 30 .. .. XX' + #13#10 +
'01 .. 19 .. .. 29 37 34 ..' + #13#10 +
'XX .. XX .. XX .. XX .. XX';

  test4: string =
'26 .. 30 32 .. .. .. 39 .. ..' + #13#10 +
'.. 28 .. .. 34 35 37 .. 40 ..' + #13#10 +
'.. 22 XX XX XX XX XX XX .. 45' + #13#10 +
'21 .. XX 78 .. .. .. XX 47 ..' + #13#10 +
'20 19 XX .. 76 .. 73 XX 51 ..' + #13#10 +
'.. 17 XX .. .. 68 .. XX .. 52' + #13#10 +
'.. 14 XX .. 82 71 .. XX 55 ..' + #13#10 +
'.. 13 XX XX 01 66 XX XX .. 54' + #13#10 +
'.. 10 .. .. 04 .. .. .. 58 ..' + #13#10 +
'.. 09 07 05 .. .. .. .. .. 60';

  test5: string =
'-2 -2 15 00 00 00 00 45' + #13#10 +
'-2 -2 00 19 17 42 41 00' + #13#10 +
'00 00 -2 -2 00 00 00 00' + #13#10 +
'00 12 -2 -2 00 48 00 00' + #13#10 +
'00 00 24 00 -2 -2 00 34' + #13#10 +
'08 00 26 00 -2 -2 00 00' + #13#10 +
'05 07 01 00 28 00 -2 -2' + #13#10 +
'00 00 00 00 00 31 -2 -2';

  test6: string =
'-2 -2 31 00 33 34 00 00 07 -2' + #13#10 +
'00 28 00 00 00 03 00 00 06 -2' + #13#10 +
'00 00 37 00 20 18 01 15 09 00' + #13#10 +
'00 00 00 00 00 00 00 00 00 00' + #13#10 +
'00 00 22 00 40 00 00 44 13 00' + #13#10 +
'87 86 90 92 00 53 42 00 00 47' + #13#10 +
'00 83 00 00 00 00 00 50 00 68' + #13#10 +
'82 00 56 58 61 00 00 49 00 00' + #13#10 +
'-2 00 00 77 00 00 00 00 00 00' + #13#10 +
'-2 79 78 00 75 73 71 00 -2 -2';

type
  TPointPos = class
    X, Y, V : Integer;

    constructor Create(AV, AX, AY : Integer);
    function Clone: TPointPos;
  end;

  TPointPosList = TObjectList<TPointPos>;

  TJumpState = (jsSolved, jsOneSol, jsPartial, jsNoSol);

  TJump = class
  private
  public
    Steps: TObjectList<TPointPosList>;
    PartList: TPointPosList;
    ForceUse: TPointPosList;

    PointLow: TPointPos;
    PointHigh: TPointPos;
    Solved: Boolean;

    constructor Create(P1, P2: TPointPos);
    destructor Destroy; override;

    procedure PrepareSolve;
    function NrSteps: Integer;

    function GetState: TJumpState;

  end;

type
  TMap = class
  private
    FWidth: Integer;
    FHeight: Integer;

    procedure SetHeight(const Value: Integer);
    procedure SetWidth(const Value: Integer);

    procedure SolveJump(Index: Integer);
    function SolveJumpPart(const Jump: TJump; const StartPoint: TPointPos; const StepIndex, DepthLeft: Integer): Boolean;

    function AllSolved: Boolean;
  public
    StartMap: array of array of Integer;
    WorkMap: array of array of Integer;
    CoverageMap: array of array of Integer;
    JumpList: TObjectlist<TJump>;

    constructor Create(const Width, Height: Integer);
    destructor Destroy; override;

    procedure BuildJumps;
    procedure CreateWorkMap;
    procedure CheckCoverage;
    procedure SolveJumps(ExcludeJump: TJump = nil);
    procedure SolveAndFixJumps;
    procedure Solve(Jump: TJump);

    function TrySolve: boolean;

    class function FromString(const s: string): TMap;
    class function FromFile(const Filename: string): TMap;

    property Width: Integer read FWidth write SetWidth;
    property Height: Integer read FHeight write SetHeight;
  end;

implementation

uses
  Math, Classes, SysUtils, IntegerList;

procedure TMap.CheckCoverage;
var
  i, j, jmp: Integer;
  Jump: TJump;
  CheckValue: Integer;
begin
  SetLength(CoverageMap, FWidth, FHeight);

  for i := 0 to FWidth - 1 do
  begin
    for j := 0 to FHeight - 1 do
    begin
      CoverageMap[i,j] := 0;
    end;
  end;

  // fillmap
  for jmp := 0 to JumpList.Count - 1 do
  begin
    Jump := JumpList[jmp];
    if Jump.Solved then
      CONTINUE;

    CheckValue := Jump.PointLow.V;

    for i := 0 to Jump.NrSteps - 1 do
    begin
      for j := 0 to Jump.Steps[i].Count - 1 do
      begin
        if CoverageMap[jump.Steps[i][j].X, jump.Steps[i][j].Y] = 0 then
          CoverageMap[jump.Steps[i][j].X, jump.Steps[i][j].Y] := CheckValue
        else
        if CoverageMap[jump.Steps[i][j].X, jump.Steps[i][j].Y] <> CheckValue then
          CoverageMap[jump.Steps[i][j].X, jump.Steps[i][j].Y] := -1;
      end;
    end;
  end;

  for jmp := 0 to JumpList.Count - 1 do
  begin
    Jump := JumpList[jmp];
    if Jump.Solved then
      CONTINUE;

    CheckValue := Jump.PointLow.V;

    Jump.ForceUse.Clear;

    for i := 0 to FWidth - 1 do
    begin
      for j := 0 to FHeight - 1 do
      begin
        if CoverageMap[i,j] = CheckValue then
        begin
          Jump.ForceUse.Add(TPointPos.Create(0,i,j));
        end;
      end;
    end;
  end;

end;

constructor TMap.Create(const Width, Height: Integer);
begin
  inherited Create;

  FWidth := Width;
  FHeight := Height;

  SetLength(StartMap, FWidth, FHeight);
  SetLength(CoverageMap, FWidth, FHeight);
end;

procedure TMap.CreateWorkMap;
var
  i, j: Integer;
begin
  SetLength(WorkMap, FWidth, FHeight);

  for i := 0 to FWidth - 1 do
  begin
    for j := 0 to FHeight - 1 do
    begin
      WorkMap[i,j] := StartMap[i,j];
    end;
  end;
end;

destructor TMap.Destroy;
begin
  JumpList.Free;

  inherited;
end;

class function TMap.FromFile(const Filename: string): TMap;
var
  i: integer;
  sl: TStringlist;
  s: string;
  descr: string;
  Correctfile: Boolean;
begin
  Correctfile := False;

  sl := TStringList.Create;
  sl.LoadFromFile(Filename);

  if Sl.Count > 10 then
  begin
    Descr := trim(sl[5]);

    s := '';

    for i := 7 to sl.Count - 1 do
    begin
      if pos('========= www.Hidato.com ===========', sl[i]) > 0 then
      begin
        Correctfile := True;
        BREAK;
      end;

      if s ='' then
        s := trim(sl[i])
      else
        s := s + #13#10 + trim(sl[i]);
    end;
  end;

  if Correctfile then
    Result := FromString(s)
  else
    REsult := nil;

  sl.Free;
end;

class function TMap.FromString(const s: string): TMap;
var
  i, j: Integer;
  slRows, slRow: TStringlist;
begin
  slRows := TStringList.Create;
  slRow := TStringList.Create;

  slRows.Text := s;

  slRow.Delimiter := ' ';
  slRow.DelimitedText := slRows[0];

  Result := TMap.Create(slRows.Count, slRow.Count);

  for i := 0 to slRows.Count - 1 do
  begin
    slRow.DelimitedText := slRows[i];
    for j := 0 to slRow.Count - 1 do
    begin
      if slRow[j][1] = 'X' then
        Result.StartMap[j,i] := -1
      else
      if slRow[j][1] = '.' then
        Result.StartMap[j,i] := 0
      else
        Result.StartMap[j,i] := StrToIntDef(slRow[j], 0);
    end;
  end;

  slRow.Free;
  slRows.Free;
end;

function TMap.AllSolved: Boolean;
var
  i: integer;
begin
  Result := True;

  for i := 0 to JumpList.Count - 1 do
  begin
    Result := Result and JumpList[i].Solved;
  end;
end;

procedure TMap.BuildJumps;
var
  i, j: Integer;
  Points: TIntegerList;
begin
  Points := TIntegerList.Create;

  for i := 0 to FWidth - 1 do
  begin
    for j := 0 to FHeight - 1 do
    begin
      if StartMap[j,i] > 0 then
        Points.AddObject(StartMap[j,i], TPointPos.Create(StartMap[j,i], j, i));
    end;
  end;

  Points.Sort;

  JumpList := TObjectlist<TJump>.Create;

  for i := 0 to Points.Count - 2 do
  begin
    if Points[i+1] - Points[i] > 1 then
    begin
      JumpList.Add(TJump.Create(TPointPos(Points.Objects[i]).Clone, TPointPos(Points.Objects[i+1]).Clone));
    end;
  end;

  for i := 0 to Points.Count - 1 do
    TPointPos(Points.Objects[i]).Free;

  Points.Free;
end;

procedure TMap.SetHeight(const Value: Integer);
begin
  FHeight := Value;
end;

procedure TMap.SetWidth(const Value: Integer);
begin
  FWidth := Value;
end;

procedure TMap.Solve(Jump: TJump);
var
  i: integer;
begin
  if Jump.Solved then
    Exit;

  case Jump.GetState of
  jsOneSol:
    begin
      Jump.Solved := True;

      for i := 0 to Jump.NrSteps - 2 do
      begin
        WorkMap[Jump.Steps[i][0].X, Jump.Steps[i][0].Y] := Jump.PointLow.V + i + 1;
      end;

      Jump.Solved := True;
    end;
  jsPartial:
    begin

      for i := 0 to Jump.NrSteps - 2 do
      begin
        if Jump.Steps[i].Count = 1 then
        begin
          WorkMap[Jump.Steps[i][0].X, Jump.Steps[i][0].Y] := Jump.PointLow.V + i + 1;

          Jump.PartList.Add(Jump.Steps[i][0].Clone);
        end;
      end;
    end;
  end;
end;

procedure TMap.SolveAndFixJumps;
var
  i: integer;
begin
  for i := 0 to JumpList.Count - 1 do
  begin
    if JumpList[i].Solved then
      CONTINUE;

    SolveJump(i);
    Solve(JumpList[i]);
  end;
end;

function TMap.TrySolve: boolean;
const
  MAXTRIES = 10;
var
  i: integer;
begin
  BuildJumps;
  CreateWorkMap;

  Result := False;

  for i := 0 to MAXTRIES do
  begin
    SolveAndFixJumps;
    CheckCoverage;

    if AllSolved then
    begin
      Result := True;
      BREAK;
    end;
  end;

end;

procedure TMap.SolveJump(Index: Integer);
var
  Jump: TJump;
  i: Integer;
begin
  Jump := JumpList[Index];

  if jump.Solved then
    EXIT;

  Jump.PrepareSolve;

  for i := 0 to Jump.PartList.Count - 1 do
  begin
    WorkMap[Jump.PartList[i].X, Jump.PartList[i].Y] := 0;
  end;

  Jump.PartList.Clear;

  SolveJumpPart(Jump, Jump.PointLow, 0, Jump.NrSteps -1)
end;

function TMap.SolveJumpPart(const Jump: TJump; const StartPoint: TPointPos; const StepIndex,  DepthLeft: Integer): Boolean;
var
  i, x, y: integer;
  Nx,Ny: integer;
  NewPoint: TPointPos;
  CanStore: Boolean;
begin
  Result := False;

  for x := -1 to 1 do
  begin
    for y := -1 to 1 do
    begin
      Nx := StartPoint.X + X;
      Ny := StartPoint.Y + Y;

      if Nx < 0 then
        CONTINUE;

      if Ny < 0 then
        CONTINUE;

      if Nx >= width then
        CONTINUE;

      if Ny >= Height then
        CONTINUE;

      if WorkMap[Nx,Ny] <> 0 then
        CONTINUE;

      if Max(Abs(Nx - Jump.PointHigh.X), Abs(Ny - Jump.PointHigh.Y)) > DepthLeft  then
        CONTINUE;

      WorkMap[Nx,Ny] := 1;

      NewPoint := TPointPos.Create(0,Nx,Ny);

      if DepthLeft = 1 then
      begin
        CanStore := True;
        for i := 0 to Jump.ForceUse.Count - 1 do
        begin
          if WorkMap[Jump.ForceUse[i].x, Jump.ForceUse[i].y] = 0 then
          begin
            CanStore := False;
            BREAK
          end;
        end;

      end
      else
      begin
        CanStore := SolveJumpPart(Jump, NewPoint, StepIndex + 1, DepthLeft - 1);
      end;

      if CanStore then
      begin
        if (Jump.Steps[StepIndex].Count = 1) and
           (Jump.Steps[StepIndex][0].X = NewPoint.X) and
           (Jump.Steps[StepIndex][0].Y = NewPoint.Y) then
        begin
          NewPoint.Free;
        end
        else
        begin
          Jump.Steps[StepIndex].Add(NewPoint);
        end;

        Result := True
      end;

      WorkMap[Nx,Ny] := 0;
    end;
  end;
end;

procedure TMap.SolveJumps(ExcludeJump: TJump);
var
  i: integer;
begin
  for i := 0 to JumpList.Count - 1 do
  begin
    if JumpList[i] <> ExcludeJump then
    begin
      SolveJump(i);
    end;
  end;
end;

{ TPointPos }

function TPointPos.Clone: TPointPos;
begin
  Result := TPointPos.Create(V,X,Y);
end;

constructor TPointPos.Create(AV, AX, AY: Integer);
begin
  inherited Create;
  V := AV;
  X := AX;
  Y := AY;
end;

{ TJump }

constructor TJump.Create(P1, P2: TPointPos);
begin
  inherited Create;

  PointLow := P1;
  PointHigh := P2;

  Solved := False;

  PartList := TPointPosList.Create;
  ForceUse := TPointPosList.Create;
end;

destructor TJump.Destroy;
begin
  Steps.Free;
  PartList.Free;
  ForceUse.Free;

  inherited;
end;

function TJump.NrSteps: Integer;
begin
  Result := PointHigh.V - PointLow.V;
end;

function TJump.GetState: TJumpState;
var
  i: integer;
begin
  if Solved then
  begin
    Result := jsSolved;
    EXIT;
  end;

  if Steps[0].Count = 1 then
    Result := jsOneSol
  else
    Result := jsNoSol;

  for i := 0 to NrSteps - 2 do
  begin
    if Steps[i].Count = 1 then
    begin
      if Result = jsNoSol then
      begin
        Result := jsPartial;
        BREAK;
      end;
    end
    else
    begin
      if Result = jsOneSol then
      begin
        Result := jsPartial;
        BREAK;
      end;
    end;
  end;
end;


procedure TJump.PrepareSolve;
var
  i: integer;
begin
  if assigned(Steps) then
    Steps.Free;

  Steps := TObjectList<TObjectList<TPointPos>>.Create;

  for i := 0 to NrSteps - 1 do
    Steps.Add(TObjectList<TPointPos>.Create);
end;

end.
