unit MapBuilder;

interface

uses
  Map;

type
  TMapBuilder = class
  private
    FWidth: Integer;
    FHeight: Integer;
    procedure SetHeight(const Value: Integer);
    procedure SetWidth(const Value: Integer);

    function HasIslands: Boolean;
  public
    Map: array of array of integer;
    PointPosList: TPointPosList;

    constructor Create(Size: Integer);
    destructor Destroy; override;

    procedure Generate;

    property Width: Integer read FWidth write SetWidth;
    property Height: Integer read FHeight write SetHeight;
  end;

implementation

uses
  Math;

constructor TMapBuilder.Create(Size: Integer);
begin
  inherited Create;

  Height := Size;
  Width := Size;

  SetLength(Map, FWidth, FHeight);
  PointPosList := TPointPosList.Create;
end;

destructor TMapBuilder.Destroy;
begin
  PointPosList.Free;

  inherited;
end;

procedure TMapBuilder.Generate;
var
  i, cnt: integer;
  Pos: integer;
  NewPoint: TPointPos;
  nx, ny: integer;
  UndoCount: integer;
  NrUndo: integer;
begin
  Randomize;

  cnt := 0;
  while true do
  begin
    nx := Random(Width);
    ny := Random(Height);

    if Map[nx, ny] = 0 then
    begin
      NewPoint := TPointPos.Create(1, nx, ny);
      Map[nx,ny] := 1;
      PointPosList.Add(NewPoint);

      BREAK;
    end;

    inc(cnt);

    if cnt = 100 then
      EXIT;
  end;

  UndoCount := 0;
  Pos := 1;
  while true do
  begin
    cnt := 0;
    while True do
    begin

      nx := PointPosList[Pos - 1].X + Random(3) - 1;
      ny := PointPosList[Pos - 1].Y + Random(3) - 1;

      if nx < 0 then
        nx := 0
      else if nx >= Width then
        nx := Width - 1;

      if ny < 0 then
        ny := 0
      else if ny >= Height then
        ny := Height - 1;

      if Map[nx, ny] = 0 then
      begin
        Map[nx,ny] := Pos + 1;
        if HasIslands then
        begin
          Map[nx,ny] := 0;
        end
        else
        begin
          NewPoint := TPointPos.Create(Pos + 1, nx, ny);
          PointPosList.Add(NewPoint);

          BREAK;
        end;
      end;

      inc(cnt);

      if cnt = 15 then
        BREAK;
    end;

    // no pos found do random undo
    if cnt = 15 then
    begin
      if UndoCount = 10000 then
        EXIT;

      NrUndo := Random(PointPosList.Count - 2);
      for i := PointPosList.Count - 1 downto PointPosList.Count - NrUndo do
      begin
        Map[PointPosList[i].X, PointPosList[i].Y] := 0;
        PointPosList.Delete(i);
      end;

      dec(Pos, NrUndo + 1);
      inc(UndoCount);
    end;

    Inc(Pos);

    if Pos = Width * Height then
      Exit;
  end;
end;

function TMapBuilder.HasIslands: Boolean;
const
  MARKCHECK = -100;
var
  p, x, y: integer;
  nx, ny: integer;
  PosList : TPointPosList;
begin
  PosList := TPointPosList.Create;

  // findstart
  for x := 0 to Width - 1 do
  begin
    for y := 0 to Height - 1 do
    begin
      if Map[X,Y] = 0 then
      begin
        if PosList.Count = 0 then
          PosList.Add(TPointPos.Create(0,X,Y));
      end;
    end;
  end;

  p := 0;

  While p < PosList.Count do
  begin
    for x := -1 to 1 do
    begin
      for y := -1 to 1 do
      begin
        nx := PosList[p].x + x;
        ny := PosList[p].y + y;

        if (nx < 0) or (nx >= Width) then
          CONTINUE;

        if (ny < 0) or (ny >= Height) then
          CONTINUE;

        if Map[nx,ny] = 0 then
        begin
           Map[nx, ny] := MARKCHECK;
           PosList.Add(TPointPos.Create(0,nx,ny));
        end;

      end;
    end;

    Inc(p);
  end;

  PosList.Free;

  // check zeros
  Result := False;
  for x := 0 to Width - 1 do
  begin
    for y := 0 to Height - 1 do
    begin
      if Map[X,Y] = 0 then
        Result := True;
    end;
  end;

  // clear marks
  for x := 0 to Width - 1 do
  begin
    for y := 0 to Height - 1 do
    begin
      if Map[X,Y] = MARKCHECK then
        Map[X,Y] := 0
    end;
  end;
end;

procedure TMapBuilder.SetHeight(const Value: Integer);
begin
  FHeight := Value;
end;

procedure TMapBuilder.SetWidth(const Value: Integer);
begin
  FWidth := Value;
end;

end.
