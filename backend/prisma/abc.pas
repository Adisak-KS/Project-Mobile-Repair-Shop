// List Form
procedure THOSxPBookstoreProductTypeListForm.cxButtonAddClick(Sender: TObject);
begin
  ExecuteRTTIFunction
    ('HOSxPBookstoreProductTypeEntryFormUnit.THOSxPBookstoreProductTypeEntryForm',
    'DoShowForm', [0]);
  DoRefreshData;
end;


procedure THOSxPBookstoreProductTypeListForm.cxButtonEditClick(Sender: TObject);
begin
  if ProductTypeCDS.RecordCount = 0 then
    Exit;
  ExecuteRTTIFunction
    ('HOSxPBookstoreProductTypeEntryFormUnit.THOSxPBookstoreProductTypeEntryForm',
    'DoShowForm', [ProductTypeCDS.FieldByName('bookstore_products_type_id')
    .AsInteger]);
  DoRefreshData;
end;


procedure THOSxPBookstoreProductEntryForm.cxButtonDeleteClick(Sender: TObject);
begin
  if MessageDlg('ยืนยันการลบ', mtConfirmation, [mbYes, mbNo], 0) = mrYes then
  begin
    DoDeleteData;
    Close;
  end;
end;


procedure THOSxPBookstoreProductListForm.cxButtonLogClick(Sender: TObject);
begin
  SafeLoadPackage('HOSxPUserManagerPackage.bpl');
  ExecuteRTTIFunction
    ('HOSxPUserManagerLogViewerFormUnit.THOSxPUserManagerLogViewerForm',
    'DoShowForm', ['bookstore_products', '']);
end;


procedure THOSxPBookstoreProductListForm.cxButtonExcelClick(Sender: TObject);
begin
  if ProductCDS.RecordCount = 0 then
    Exit;
  DoExportCxGridToExcel(cxGrid1);
end;


// Entry Form
 
 
 
 
 
 
 
 
 private
    FCustomerID: integer;
    procedure DoSaveData;
    procedure DoDeleteData;
    procedure DoRefreshData;
    procedure SetCustomerID(const Value: integer);
    { Private declarations }
  public
    class procedure DoShowForm(CustomerListID: integer);
    property CustomerID: integer read FCustomerID write SetCustomerID;


uses BMSApplicationUtil, HOSxPDMU, siauto;



procedure THOSxPBookstoreProductEntryForm.cxButtonLogClick(Sender: TObject);
begin
  SafeLoadPackage('HOSxPUserManagerPackage.bpl');
  ExecuteRTTIFunction
    ('HOSxPUserManagerLogViewerFormUnit.THOSxPUserManagerLogViewerForm',
    'DoShowForm', ['bookstore_products', IntToStr(FProductID)]);
end;


// 1. Set Customer Id
procedure THOSxPPharmacyCustomerEntryForm.SetCustomerID(const Value: integer);
begin
  FCustomerID := Value;

  if FCustomerID = 0 then
  begin
    repeat
      FCustomerID := GetSerialNumber('pharmacy_customer_id');
    until GetSQLData
      ('SELECT COUNT(*) FROM pharmacy_customer WHERE pharmacy_customer_id=' +
      IntToStr(FCustomerID)) = 0;
  end;
  DoRefreshData;
end;


// 2. Show Modal
class procedure THOSxPPharmacyCustomerEntryForm.DoShowForm(CustomerListID
  : integer);
var
  HOSxPPharmacyCustomerEntryForm: THOSxPPharmacyCustomerEntryForm;
begin
  HOSxPPharmacyCustomerEntryForm := THOSxPPharmacyCustomerEntryForm.Create
    (Application);
  try
    HOSxPPharmacyCustomerEntryForm.CustomerID := CustomerListID;
    HOSxPPharmacyCustomerEntryForm.ShowModal;
  finally
    HOSxPPharmacyCustomerEntryForm.Free;
  end;

end;


procedure THOSxPPharmacyEmployeeEntryForm.DoRefreshData;
begin
  employeeCDS.Data := HOSxP_GetDataSet('SELECT * FROM pharmacy_employee WHERE ' +
    'pharmacy_employee_id=' + IntToStr(FEmployeeID));
  if employeeCDS.RecordCount = 0 then
  begin
    employeeCDS.Append;
  end
  else
  begin
    employeeCDS.Edit;
  end;
  if employeeCDS.ChangeCount > 0 then
  begin
    HOSxP_UpdateDelta_log(employeeCDS,'SELECT * FROM pharmacy_employee WHERE ' +
      'pharmacy_employee_id=' + IntToStr(FEmployeeID),'pharmacy_employee',IntToStr(FEmployeeID),'');
    employeeCDS.MergeChangeLog;
  end;
end;



procedure THOSxPBookstoreCustomerEntryForm.CustomerCDSBeforePost
  (DataSet: TDataSet);
begin
  if CustomerCDS.State in [dsInsert] then
  begin
    CustomerCDS.FieldByName('bookstore_customer_id').AsInteger := FCustomerID;
    CustomerCDS.FieldByName('bookstore_customer_createdat').AsDateTime := Now;
    CustomerCDS.FieldByName('bookstore_customer_updatedat').AsDateTime := Now;
  end

  else if CustomerCDS.State in [dsEdit] then
  begin
    CustomerCDS.FieldByName('bookstore_customer_updatedat').AsDateTime := Now;
  end;



  procedure THOSxPBookstoreCustomerEntryForm.DoRefreshData;
begin
  // 2. Add Inser or edit
  CustomerCDS.Data := HOSxP_GetDataSet
    ('SELECT * FROM bookstore_customers WHERE bookstore_customer_id = ' +
    IntToStr(FCustomerID));

  if CustomerCDS.RecordCount = 0 then
    CustomerCDS.Append // Create New Customer
  else
    CustomerCDS.Edit; // Update Customer

end;



procedure THOSxPBookstoreCustomerEntryForm.DoSaveData;
begin
  simain.LogDebug('Do Save Data');

  if CustomerCDS.State in [dsInsert, dsEdit] then
  begin
    CustomerCDS.Post;
  end;

  // Save Data to Database
  if CustomerCDS.ChangeCount > 0 then
  begin
    HOSxP_updateDelta_log(CustomerCDS,
      'SELECT * FROM bookstore_customers WHERE ' + 'bookstore_customer_id =' +
      IntToStr(FCustomerID), 'Bookstore_customers', IntToStr(FCustomerID), '');
  end;

end;

procedure THOSxPBookstoreEmployeeEntryForm.DoRefreshData;
begin
  simain.LogDebug('DoRefreshData');

  EmployeeCDS.Data := HOSxP_GetDataSet
    ('SELECT * FROM bookstore_employees WHERE ' + 'bookstore_employee_id =' +
    IntToStr(FEmployeeID));

  if EmployeeCDS.RecordCount = 0 then
  begin
    EmployeeCDS.Append
  end
  else
  begin
    EmployeeCDS.Edit
  end;
end;


procedure THOSxPPharmacyTypeEntryForm.DoDeleteData;
begin
  if typeCDS.State in [dsEdit] then
  begin
    typeCDS.Cancel;
  end;
  if typeCDS.RecordCount > 0 then
  begin
    typeCDS.Delete;
  end;
  if typeCDS.ChangeCount > 0 then
  begin
    HOSxP_UpdateDelta_log(typeCDS,'SELECT * FROM pharmacy_type WHERE ' +
      'pharmacy_type_id=' +IntToStr(FTypeID),'pharmacy_type',IntToStr(FTypeID),'');
    typeCDS.MergeChangeLog;
  end;


end;

procedure THOSxPPharmacyTypeEntryForm.FormShow(Sender: TObject);
begin
  if typeCDS.State in [dsInsert] then
  begin
    cxButton2.Enabled := false;
  end;
end;

procedure THOSxPBookstoreEmployeeListForm.cxButtonExcelClick(Sender: TObject);
begin
  if EmployeeCDS.RecordCount = 0 then
    Exit;
  DoExportCxGridToExcel(cxGrid1);
end;


procedure THOSxPBookstoreEmployeeListForm.cxButtonExcelClick(Sender: TObject);
begin
  if EmployeeCDS.RecordCount = 0 then
    Exit;
  DoExportCxGridToExcel(cxGrid1);
end;

procedure THOSxPBookstoreEmployeeListForm.cxButtonLogClick(Sender: TObject);
begin
  SafeLoadPackage('HOSxPUserManagerPackage.bpl');
  ExecuteRTTIFunction
    ('HOSxPUserManagerLogViewerFormUnit.THOSxPUserManagerLogViewerForm',
    'DoShowForm', ['bookstore_employee', '']);
end;



procedure THOSxPBookstoreEmployeeEntryForm.EmployeeCDSBeforePost
  (DataSet: TDataSet);
begin
  simain.LogDebug('EmployeeCDSBeforePost');

  if EmployeeCDS.State in [dsInsert] then
  begin
    EmployeeCDS.FieldByName('bookstore_employee_id').AsInteger := FEmployeeID;
    EmployeeCDS.FieldByName('bookstore_employee_createdat').AsDateTime := Now;
    EmployeeCDS.FieldByName('bookstore_employee_updatedat').AsDateTime := Now;
  end;

  if EmployeeCDS.State in [dsEdit] then
    EmployeeCDS.FieldByName('bookstore_employee_updatedat').AsDateTime := Now;
end;

// List Form

// Edit Button 
  if customerCDS.RecordCount = 0 then
    Exit;
  ExecuteRTTIFunction
    ('HOSxPPharmacyCustomerEntryFormUnit.THOSxPPharmacyCustomerEntryForm', 'DoShowForm',
    [customerCDS.FieldByName('pharmacy_customer_id').AsInteger]);
  DoRefreshData;






procedure THOSxPPharmacyOrderListForm.DoRefreshData;
var
  date, name: string;
begin
  if (cxDateEdit1.Text <> '') AND (cxDateEdit2.Text <> '') then
  begin
    date := ' AND po.pharmacy_order_date BETWEEN ' +
      QuotedStr(FormatDateTime('yyyy-mm-dd', cxDateEdit1.date)) + 'AND' +
      QuotedStr(FormatDateTime('yyyy-mm-dd', cxDateEdit2.date));
  end;

  if cxTextEdit1.Text <> '' then
  begin
    name := ' AND pc.pharmacy_customer_name LIKE ' +
      QuotedStr('%' + cxTextEdit1.Text + '%') +
      'OR pe.pharmacy_employee_name LIKE ' +
      QuotedStr('%' + cxTextEdit1.Text + '%');
  end;

  orderCDS.Data := HOSxP_GetDataSet('SELECT * FROM pharmacy_order po ' +
    'LEFT JOIN pharmacy_employee pe on pe.pharmacy_employee_id = po.pharmacy_employee_id '
    + 'LEFT JOIN pharmacy_customer pc on po.pharmacy_customer_id = pc.pharmacy_customer_id '
    + 'WHERE 1=1' + date + name);
end;




