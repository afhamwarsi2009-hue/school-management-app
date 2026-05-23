USE school_management;
GO

CREATE OR ALTER PROCEDURE dbo.RecordPaymentResult
  @RazorpayOrderId NVARCHAR(120),
  @RazorpayPaymentId NVARCHAR(120),
  @Status NVARCHAR(30)
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE dbo.payments
  SET
    RazorpayPaymentId = @RazorpayPaymentId,
    Status = @Status
  WHERE RazorpayOrderId = @RazorpayOrderId;
END;
GO
