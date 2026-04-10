export type CreatePurchaseRequestPayload = {
  itemName: string
  quantity: number
  unit: string
  requiresDeposit: boolean
}

export type PurchaseRequestResponse = {
  id: number
  itemName: string
  quantity: number
  unit: string
  requiresDeposit: boolean
  status: 'Open'
  createdAt: string
}

export type InvoiceItem = {
  id: number
  invoiceNumber: string
  customerName: string
  totalAmount: number
  status: string
  issuedAt: string
}

export type BillItem = {
  id: number
  invoiceId: number
  invoiceNumber: string
  customerName: string
  totalAmount: number
  deadline: string
  attachmentName: string | null
  attachmentPath: string | null
  createdAt: string
  invoiceStatus: string
}

export type CreateBillPayload = {
  invoiceId: number
  totalAmount: number
  deadline: string
  file?: File | null
}

export type CreateBillResponse = BillItem
export type UpdateBillPayload = {
  customerName: string
  totalAmount: number
  invoiceStatus: string
}
export type ConfirmPaidResponse = {
  id: number
  status: string
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const mockInvoices: InvoiceItem[] = [
  {
    id: 1,
    invoiceNumber: 'INV-MOCK0001',
    customerName: 'Stellar Dynamics Corp',
    totalAmount: 42900,
    status: 'Open',
    issuedAt: new Date().toISOString(),
  },
  {
    id: 2,
    invoiceNumber: 'INV-MOCK0002',
    customerName: 'Vertex Manufacturing',
    totalAmount: 8400,
    status: 'Open',
    issuedAt: new Date().toISOString(),
  },
  {
    id: 3,
    invoiceNumber: 'INV-MOCK0003',
    customerName: 'Nexa Network Solutions',
    totalAmount: 67000,
    status: 'Completed/Invoiced',
    issuedAt: new Date().toISOString(),
  },
]

const mockBills: BillItem[] = [
  {
    id: 1,
    invoiceId: 1,
    invoiceNumber: 'INV-MOCK0001',
    customerName: 'Stellar Dynamics Corp',
    totalAmount: 42900,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    attachmentName: 'bill-0001.pdf',
    attachmentPath: 'invoice-1-mock.pdf',
    createdAt: new Date().toISOString(),
    invoiceStatus: 'Awaiting Payment',
  },
]

mockInvoices[0].status = 'Awaiting Payment'

let nextInvoiceId = Math.max(...mockInvoices.map((item) => item.id)) + 1
let nextBillId = Math.max(...mockBills.map((item) => item.id)) + 1

export const mockCreatePurchaseRequest = async (
  payload: CreatePurchaseRequestPayload,
): Promise<PurchaseRequestResponse> => {
  await wait(700)

  if (!payload.itemName.trim() || payload.quantity <= 0 || !payload.unit.trim()) {
    throw new Error('Du lieu khong hop le. Vui long kiem tra lai form.')
  }

  const now = new Date().toISOString()
  const invoiceId = nextInvoiceId++
  mockInvoices.unshift({
    id: invoiceId,
    invoiceNumber: `INV-MOCK${String(invoiceId).padStart(4, '0')}`,
    customerName: payload.itemName.trim(),
    totalAmount: payload.quantity,
    status: 'Open',
    issuedAt: now,
  })

  return {
    id: invoiceId,
    itemName: payload.itemName.trim(),
    quantity: payload.quantity,
    unit: payload.unit,
    requiresDeposit: payload.requiresDeposit,
    status: 'Open',
    createdAt: now,
  }
}

export const mockGetInvoices = async (): Promise<InvoiceItem[]> => {
  await wait(500)
  return [...mockInvoices]
}

export const mockGetBills = async (): Promise<BillItem[]> => {
  await wait(500)
  return [...mockBills].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}

export const mockCreateBill = async (
  payload: CreateBillPayload,
): Promise<CreateBillResponse> => {
  await wait(700)

  if (!Number.isFinite(payload.totalAmount) || payload.totalAmount <= 0) {
    throw new Error('Tong so tien hoa don phai lon hon 0.')
  }

  const deadlineTime = Date.parse(payload.deadline)
  if (Number.isNaN(deadlineTime) || deadlineTime <= Date.now()) {
    throw new Error('Han thanh toan khong hop le.')
  }

  const invoice = mockInvoices.find((item) => item.id === payload.invoiceId)
  if (!invoice) {
    throw new Error('Khong tim thay Purchase Request de tao Bill.')
  }

  const existingBill = mockBills.some((item) => item.invoiceId === payload.invoiceId)
  if (existingBill) {
    throw new Error('Bill da ton tai cho yeu cau nay.')
  }

  const now = new Date().toISOString()
  const attachmentName = payload.file?.name ?? null
  const createdBill: BillItem = {
    id: nextBillId++,
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customerName,
    totalAmount: payload.totalAmount,
    deadline: payload.deadline,
    attachmentName,
    attachmentPath: attachmentName ? `invoice-${invoice.id}-mock-${attachmentName}` : null,
    createdAt: now,
    invoiceStatus: 'Awaiting Payment',
  }

  invoice.status = 'Awaiting Payment'
  mockBills.unshift(createdBill)

  return createdBill
}

export const mockConfirmPaid = async (invoiceId: number): Promise<ConfirmPaidResponse> => {
  await wait(500)

  const invoice = mockInvoices.find((item) => item.id === invoiceId)
  if (!invoice) {
    throw new Error('Khong tim thay invoice can xac nhan.')
  }

  if (invoice.status !== 'Awaiting Payment') {
    throw new Error('Chi invoice dang Awaiting Payment moi co the confirm paid.')
  }

  invoice.status = 'Completed/Invoiced'
  for (const bill of mockBills) {
    if (bill.invoiceId === invoiceId) {
      bill.invoiceStatus = 'Completed/Invoiced'
    }
  }

  return {
    id: invoice.id,
    status: invoice.status,
  }
}
