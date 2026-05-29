ALTER TABLE [Reader_Setting]
ADD [page_spread] NVARCHAR(20) NOT NULL CONSTRAINT [DF_Reader_Setting_Page_Spread] DEFAULT 'NONE';
GO
