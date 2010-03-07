object FormBuilder: TFormBuilder
  Left = 0
  Top = 0
  Caption = 'Builder'
  ClientHeight = 318
  ClientWidth = 659
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  OnCreate = FormCreate
  OnPaint = FormPaint
  DesignSize = (
    659
    318)
  PixelsPerInch = 96
  TextHeight = 13
  object Button1: TButton
    Left = 448
    Top = 16
    Width = 75
    Height = 25
    Caption = 'Map 5'
    TabOrder = 0
    OnClick = Button1Click
  end
  object Button2: TButton
    Left = 448
    Top = 47
    Width = 75
    Height = 25
    Caption = 'Map 6'
    TabOrder = 1
    OnClick = Button2Click
  end
  object Button3: TButton
    Left = 448
    Top = 78
    Width = 75
    Height = 25
    Caption = 'Map 7'
    TabOrder = 2
    OnClick = Button3Click
  end
  object Button4: TButton
    Left = 448
    Top = 112
    Width = 75
    Height = 25
    Caption = 'Map 8'
    TabOrder = 3
    OnClick = Button4Click
  end
  object Button5: TButton
    Left = 448
    Top = 144
    Width = 75
    Height = 25
    Caption = 'Map 9'
    TabOrder = 4
    OnClick = Button5Click
  end
  object Button6: TButton
    Left = 448
    Top = 175
    Width = 75
    Height = 25
    Caption = 'Map 10'
    TabOrder = 5
    OnClick = Button6Click
  end
  object Button7: TButton
    Left = 448
    Top = 206
    Width = 75
    Height = 25
    Caption = 'Map 11'
    TabOrder = 6
    OnClick = Button7Click
  end
  object Button8: TButton
    Left = 448
    Top = 237
    Width = 75
    Height = 25
    Caption = 'Map 12'
    TabOrder = 7
    OnClick = Button8Click
  end
  object Button9: TButton
    Left = 448
    Top = 268
    Width = 75
    Height = 25
    Caption = 'Reduce'
    TabOrder = 8
    OnClick = Button9Click
  end
  object lbJumps: TListBox
    Left = 530
    Top = 8
    Width = 121
    Height = 270
    Anchors = [akTop, akRight, akBottom]
    ItemHeight = 13
    TabOrder = 9
    OnClick = lbJumpsClick
    OnDblClick = lbJumpsDblClick
  end
  object btnsolve: TButton
    Left = 553
    Top = 284
    Width = 75
    Height = 25
    Anchors = [akRight, akBottom]
    Caption = 'Fix'
    TabOrder = 10
    OnClick = btnsolveClick
  end
end
