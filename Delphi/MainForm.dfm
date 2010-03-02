object Form4: TForm4
  Left = 0
  Top = 0
  Caption = 'Hidato'
  ClientHeight = 317
  ClientWidth = 562
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
    562
    317)
  PixelsPerInch = 96
  TextHeight = 13
  object lbJumps: TListBox
    Left = 433
    Top = 8
    Width = 121
    Height = 270
    Anchors = [akTop, akRight, akBottom]
    ItemHeight = 13
    TabOrder = 0
    OnClick = lbJumpsClick
    OnDblClick = lbJumpsDblClick
  end
  object btnsolve: TButton
    Left = 456
    Top = 284
    Width = 75
    Height = 25
    Anchors = [akRight, akBottom]
    Caption = 'Fix'
    TabOrder = 1
    OnClick = btnsolveClick
  end
  object btnAll: TButton
    Left = 8
    Top = 284
    Width = 75
    Height = 25
    Anchors = [akLeft, akBottom]
    Caption = 'load All'
    TabOrder = 2
    OnClick = btnAllClick
  end
  object Button1: TButton
    Left = 104
    Top = 284
    Width = 75
    Height = 25
    Anchors = [akLeft, akBottom]
    Caption = 'Next'
    TabOrder = 3
    OnClick = Button1Click
  end
end
