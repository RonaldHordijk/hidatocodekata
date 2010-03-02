unit IntegerList;

interface

uses
  Classes;

{ TLongIntListCom class }
type
  PLongIntItem = ^TLongIntItem;
  TLongIntItem = record
    FLongInt: LongInt;
    FObject: TObject;
  end;

  PLongIntItemList = ^TLongIntItemList;
  TLongIntItemList = array[0..MaxListSize] of TLongIntItem;

  TIntegerList = class;

  TIntegerListEnumerator = class
  private
    FIndex: Integer;
    FList: TIntegerList;
  public
    constructor Create(AList: TIntegerList);
    function GetCurrent: LongInt;
    function MoveNext: Boolean;
    property Current: LongInt read GetCurrent;
  end;

  TIntegerList = class(TPersistent)
  private
    FList: PLongIntItemList;
    FCount: Integer;
    FCapacity: Integer;
    FSorted: Boolean;
    FDuplicates: TDuplicates;
    FUpdateCount: Integer;
    FOnChange: TNotifyEvent;
    FOnChanging: TNotifyEvent;
    procedure ExchangeItems(Index1, Index2: Integer);
    procedure Grow;
    procedure QuickSort(L, R: Integer);
    procedure InsertItem(Index: Integer; const Value: LongInt);
    procedure SetSorted(Value: Boolean);
  protected
    procedure Changed; virtual;
    procedure Changing; virtual;
    procedure Error(const Msg: string; Data: Integer);
    function  Get(Index: Integer): LongInt; virtual;
    function  GetCapacity: Integer; virtual;
    function  GetCount: Integer; virtual;
    function  GetObject(Index: Integer): TObject; virtual;
    procedure Put(Index: Integer; const Value: Longint); virtual;
    procedure PutObject(Index: Integer; AObject: TObject); virtual;
    procedure SetCapacity(NewCapacity: Integer); virtual;
    procedure SetUpdateState(Updating: Boolean); virtual;
    function  GetTextStr: string; virtual;
    procedure SetTextStr(const Value: string); virtual;
  public
    destructor Destroy; override;
    function  Add(const Value: LongInt): Integer; virtual;
    function  AddObject(const Value: LongInt; AObject: TObject): Integer; virtual;
    procedure AddIdList(AIdList: TIntegerList); virtual;
    procedure Append(const Value: Longint);
    procedure Assign(Source: TIntegerList); reintroduce;
    procedure BeginUpdate;
    procedure Clear; virtual;
    procedure Delete(Index: Integer); virtual;
    procedure EndUpdate;
    function  Equals(AIdList: TIntegerList): Boolean; reintroduce;
    procedure Exchange(Index1, Index2: Integer); virtual;
    function  Find(const Value: LongInt; var Index: Integer): Boolean; virtual;
    function  IndexOf(const Value: LongInt): Integer; virtual;
    function  IndexOfObject(AObject: TObject): Integer;
    procedure Insert(Index: Integer; const Value: Longint); virtual;
    procedure InsertObject(Index: Integer; const Value: Longint;
                AObject: TObject);
    function Last(): Integer;
    procedure LoadFromFile(const Filename: string); virtual;
    procedure LoadFromStream(Stream: TStream); virtual;
    procedure Move(CurIndex, NewIndex: Integer); virtual;
    function  Remove(const Value: LongInt): Longint; virtual;
    procedure Release; virtual; export;
    procedure SaveToFile(const Filename: string); virtual;
    procedure SaveToStream(Stream: TStream); virtual;
    procedure Sort; virtual;
    function GetEnumerator: TIntegerListEnumerator;
    function CompareTo(AIntegerList: TIntegerList): Integer;
    function HasIdenticalContentsAs(AIntegerList: TIntegerList): Boolean;

    property  Capacity: Integer read GetCapacity write SetCapacity;
    property  Count: Integer read GetCount;
    property  Duplicates: TDuplicates read FDuplicates write FDuplicates;
    property  Sorted: Boolean read FSorted write SetSorted;
    property  Objects[Index: Integer]: TObject read GetObject write PutObject;
    property  Values[Index: Integer]: Longint read Get write Put; default;
    property  Items[Index: Integer]: Longint read Get write Put;

    property  OnChange: TNotifyEvent read FOnChange write FOnChange;
    property  OnChanging: TNotifyEvent read FOnChanging write FOnChanging;
  end;

implementation

uses
  RTLConsts, SysUtils;

destructor TIntegerList.Destroy;
begin
  FOnChange := nil;
  FOnChanging := nil;
  inherited Destroy;
  FCount := 0;
  SetCapacity(0);
end;

function TIntegerList.Add(const Value: LongInt): Integer;
begin
  if not Sorted then
    Result := FCount
  else
    if Find(Value, Result) then
      case Duplicates of
        dupIgnore: Exit;
        dupError: Error(SDuplicateString, 0);
      end;
  InsertItem(Result, Value);
end;

procedure TIntegerList.Changed;
begin
  if (FUpdateCount = 0) and Assigned(FOnChange) then FOnChange(Self);
end;

procedure TIntegerList.Changing;
begin
  if (FUpdateCount = 0) and Assigned(FOnChanging) then FOnChanging(Self);
end;

procedure TIntegerList.Clear;
begin
  if FCount <> 0 then begin
    Changing;
    FCount := 0;
    SetCapacity(0);
    Changed;
  end;
end;

function TIntegerList.CompareTo(AIntegerList: TIntegerList): Integer;
var
  i: Integer;
begin
  Result := AIntegerList.Count - Count;
  if Result <> 0 then
    EXIT;

  for i := 0 to Count-1 do
  begin
    Result := AIntegerList[i] - Items[i];
    if Result <> 0 then
      EXIT;
  end;
end;

procedure TIntegerList.Delete(Index: Integer);
begin
  if (Index < 0) or (Index >= FCount) then Error(SListIndexError, Index);
  Changing;
  Dec(FCount);
  if Index < FCount then
    System.Move(FList^[Index + 1], FList^[Index],
      (FCount - Index) * SizeOf(TLongIntItem));
  Changed;
end;

procedure TIntegerList.Exchange(Index1, Index2: Integer);
begin
  if (Index1 < 0) or (Index1 >= FCount) then Error(SListIndexError, Index1);
  if (Index2 < 0) or (Index2 >= FCount) then Error(SListIndexError, Index2);
  Changing;
  ExchangeItems(Index1, Index2);
  Changed;
end;

procedure TIntegerList.ExchangeItems(Index1, Index2: Integer);
var
  Temp: Integer;
  Item1, Item2: PLongIntItem;
begin
  Item1 := @FList^[Index1];
  Item2 := @FList^[Index2];
  Temp := Integer(Item1^.FLongInt);
  Integer(Item1^.FLongInt) := Integer(Item2^.FLongInt);
  Integer(Item2^.FLongInt) := Temp;
  Temp := Integer(Item1^.FObject);
  Integer(Item1^.FObject) := Integer(Item2^.FObject);
  Integer(Item2^.FObject) := Temp;
end;

function TIntegerList.Find(const Value: LongInt; var Index: Integer): Boolean;
var
  L, H, i: Integer;
  C: Int64;
begin
  if Sorted then
  begin
    Result := False;
    L := 0;
    H := FCount - 1;
    while L <= H do
    begin
      i := (L + H) shr 1;
      C := int64(FList^[i].FLongInt) - int64(Value);
      if C < 0 then
        L := i + 1
      else
      begin
        H := i - 1;
        if C = 0 then
        begin
          Result := True;
          if Duplicates <> dupAccept then
            L := i;
        end;
      end;
    end;
    Index := L;
  end else begin
    Index := IndexOf(Value);
    Result := Index >= 0;
  end;
end;

function TIntegerList.Get(Index: Integer): LongInt;
begin
  if (Index < 0) or (Index >= FCount) then Error(SListIndexError, Index);
  Result := FList^[Index].FLongInt;
end;

function TIntegerList.GetCapacity: Integer;
begin
  Result := FCapacity;
end;

function TIntegerList.GetCount: Integer;
begin
  Result := FCount;
end;

function TIntegerList.GetObject(Index: Integer): TObject;
begin
  if (Index < 0) or (Index >= FCount) then Error(SListIndexError, Index);
  Result := FList^[Index].FObject;
end;

procedure TIntegerList.Grow;
var
  Delta: Integer;
begin
  if FCapacity > 64 then Delta := FCapacity div 4 else
    if FCapacity > 8 then Delta := 16 else
      Delta := 4;
  SetCapacity(FCapacity + Delta);
end;

function TIntegerList.HasIdenticalContentsAs(
  AIntegerList: TIntegerList): Boolean;
begin
  Result := CompareTo(AIntegerList) = 0;
end;

function TIntegerList.IndexOf(const Value: LongInt): Integer;
begin
  if not Sorted then begin
    for Result := 0 to GetCount - 1 do
      if Value = Get(Result) then Exit;
    Result := -1;
  end else
    if not Find(Value, Result) then
      Result := -1;
end;

procedure TIntegerList.Insert(Index: Integer; const Value: LongInt);
begin
  if Sorted then Error(SSortedListError, 0);
  if (Index < 0) or (Index > FCount) then Error(SListIndexError, Index);
  InsertItem(Index, Value);
end;

procedure TIntegerList.InsertItem(Index: Integer; const Value: LongInt);
begin
  Changing;
  if FCount = FCapacity then Grow;
  if Index < FCount then
    System.Move(FList^[Index], FList^[Index + 1],
      (FCount - Index) * SizeOf(TLongIntItem));
  with FList^[Index] do begin
    FLongint := Value;
    FObject := nil;
  end;
  Inc(FCount);
  Changed;
end;

procedure TIntegerList.Put(Index: Integer; const Value: Longint);
begin
  if Sorted then Error(SSortedListError, 0);
  if (Index < 0) or (Index >= FCount) then Error(SListIndexError, Index);
  Changing;
  FList^[Index].FLongint := Value;
  Changed;
end;

procedure TIntegerList.PutObject(Index: Integer; AObject: TObject);
begin
  if (Index < 0) or (Index >= FCount) then Error(SListIndexError, Index);
  Changing;
  FList^[Index].FObject := AObject;
  Changed;
end;

procedure TIntegerList.QuickSort(L, R: Integer);
var
  i, j: Integer;
  P: Longint;
begin
  repeat
    i := L;
    j := R;
    P := FList^[(L + R) shr 1].FLongint;
    repeat
      while FList^[i].FLongInt < P do Inc(i);
      while FList^[j].FLongInt > P do Dec(j);
      if i <= j then begin
        ExchangeItems(i, j);
        Inc(i);
        Dec(j);
      end;
    until i > j;
    if L < j then
      QuickSort(L, j);
    L := i;
  until i >= R;
end;

procedure TIntegerList.SetCapacity(NewCapacity: Integer);
begin
  ReallocMem(FList, NewCapacity * SizeOf(TLongIntItem));
  FCapacity := NewCapacity;
end;

procedure TIntegerList.SetSorted(Value: Boolean);
begin
  if FSorted <> Value then begin
    if Value then Sort;
    FSorted := Value;
  end;
end;

procedure TIntegerList.SetUpdateState(Updating: Boolean);
begin
  if Updating then Changing else Changed;
end;

procedure TIntegerList.Sort;
begin
  if not Sorted and (FCount > 1) then begin
    Changing;
    QuickSort(0, FCount - 1);
    Changed;
  end;
end;

function TIntegerList.AddObject(const Value: Longint; AObject: TObject): Integer;
begin
  Result := Add(Value);
  PutObject(Result, AObject);
end;

procedure TIntegerList.Append(const Value: Longint);
begin
  Add(Value);
end;

procedure TIntegerList.AddIdList(AIdList: TIntegerList);
var
  i: Integer;
begin
  BeginUpdate;
  try
    for i := 0 to AIdList.Count - 1 do
      AddObject(AIdList[i], AIdList.Objects[i]);
  finally
    EndUpdate;
  end;
end;

procedure TIntegerList.Assign(Source: TIntegerList);
begin
  BeginUpdate;
  try
    Clear;
    AddIdList(Source);
  finally
    EndUpdate;
  end;
end;

procedure TIntegerList.BeginUpdate;
begin
  if FUpdateCount = 0 then SetUpdateState(True);
  Inc(FUpdateCount);
end;

procedure TIntegerList.EndUpdate;
begin
  Dec(FUpdateCount);
  if FUpdateCount = 0 then SetUpdateState(False);
end;

function TIntegerList.Equals(AIdList: TIntegerList): Boolean;
var
  i, Count: Integer;
begin
  Result := False;
  Count := GetCount;
  if Count <> AIdList.GetCount then Exit;
  for i := 0 to Count - 1 do
    if Get(i) <> AIdList.Get(i) then Exit;
  Result := True;
end;

function TIntegerList.IndexOfObject(AObject: TObject): Integer;
begin
  for Result := 0 to GetCount - 1 do
    if GetObject(Result) = AObject then Exit;
  Result := -1;
end;

procedure TIntegerList.InsertObject(Index: Integer; const Value: LongInt;
  AObject: TObject);
begin
  Insert(Index, Value);
  PutObject(Index, AObject);
end;

function TIntegerList.Last: Integer;
begin
  Result := Items[Count - 1];
end;

procedure TIntegerList.LoadFromFile(const Filename: string);
var
  Stream: TStream;
begin
  Stream := TFileStream.Create(Filename, fmOpenRead or fmShareDenyWrite);
  try
    LoadFromStream(Stream);
  finally
    Stream.Free;
  end;
end;

procedure TIntegerList.LoadFromStream(Stream: TStream);
var
  Size: Integer;
  S: string;
begin
  BeginUpdate;
  try
    Size := Stream.Size - Stream.Position;
    SetString(S, nil, Size);
    Stream.Read(Pointer(S)^, Size);
    SetTextStr(S);
  finally
    EndUpdate;
  end;
end;

procedure TIntegerList.Move(CurIndex, NewIndex: Integer);
var
  TempObject: TObject;
  TempLongint: LongInt;
begin
  if CurIndex <> NewIndex then
  begin
    BeginUpdate;
    try
      TempLongint := Get(CurIndex);
      TempObject := GetObject(CurIndex);
      Delete(CurIndex);
      InsertObject(NewIndex, TempLongint, TempObject);
    finally
      EndUpdate;
    end;
  end;
end;

procedure TIntegerList.SaveToFile(const Filename: string);
var
  Stream: TStream;
begin
  Stream := TFileStream.Create(Filename, fmCreate);
  try
    SaveToStream(Stream);
  finally
    Stream.Free;
  end;
end;

procedure TIntegerList.SaveToStream(Stream: TStream);
var
  S: string;
begin
  S := GetTextStr;
  Stream.WriteBuffer(Pointer(S)^, Length(S));
end;


procedure TIntegerList.Error(const Msg: string; Data: Integer);

  function ReturnAddr: Pointer;
  asm
          MOV     EAX,[EBP+4]
  end;

begin
  raise EStringListError.CreateFmt(Msg, [Data]) at ReturnAddr;
end;

function TIntegerList.GetTextStr: string;
var
  i, L, Size, Count: Integer;
  P: PChar;
  S: string;
begin
  Count := GetCount;
  Size := 0;
  for i := 0 to Count - 1 do begin
    S := IntToStr(Get(i));
    Inc(Size, Length(S) + 2);
  end;
  SetString(Result, nil, Size);
  P := Pointer(Result);
  for i := 0 to Count - 1 do begin
    S := IntToStr(Get(i));
    L := Length(S);
    if L <> 0 then begin
      System.Move(Pointer(S)^, P^, L);
      Inc(P, L);
    end;
    P^ := #13;
    Inc(P);
    P^ := #10;
    Inc(P);
  end;
end;

procedure TIntegerList.SetTextStr(const Value: string);
var
  P, Start: PChar;
  S: string;
begin
  BeginUpdate;
  try
    Clear;
    P := Pointer(Value);
    if P <> nil then
      while P^ <> #0 do
      begin
        Start := P;
        while not CharInSet(P^, [#0, #10, #13]) do
          Inc(P);
        SetString(S, Start, P - Start);
        try
          Add(StrToInt(S));
        except
        end;
        if P^ = #13 then Inc(P);
        if P^ = #10 then Inc(P);
      end;
  finally
    EndUpdate;
  end;
end;


function TIntegerList.Remove(const Value: Integer): Longint;
begin
  Result := IndexOf(Value);
  if Result <> -1 then
    Delete(Result);
end;

procedure TIntegerList.Release;
begin
  Destroy;
end;

function TIntegerList.GetEnumerator: TIntegerListEnumerator;
begin
  Result := TIntegerListEnumerator.Create(Self);
end;

{ TLongIntListEnumerator }

constructor TIntegerListEnumerator.Create(AList: TIntegerList);
begin
  inherited Create;
  FIndex := -1;
  FList := AList;
end;

function TIntegerListEnumerator.GetCurrent: LongInt;
begin
  Result := FList[FIndex];
end;

function TIntegerListEnumerator.MoveNext: Boolean;
begin
  Result := FIndex < FList.Count - 1;
  if Result then
    Inc(FIndex);
end;

end.

