import {
  type BillItem,
  type ConfirmPaidResponse,
  type CreateBillPayload,
  type CreateBillResponse,
  type CreatePurchaseRequestPayload,
  type InvoiceItem,
  type PurchaseRequestResponse,
} from '../mocks/purchaseRequestMockApi'

type ApiMode = 'real'

const API_MODE: ApiMode = 'real'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

const createPurchaseRequestReal = async (
  payload: CreatePurchaseRequestPayload,
): Promise<PurchaseRequestResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/purchase-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let errorMessage = `Real API failed (${response.status})`
    try {
      const errorBody = (await response.json()) as { message?: string; error?: string }
      errorMessage = errorBody.message ?? errorBody.error ?? errorMessage
    } catch {
      // keep default message when response is not JSON
    }
    throw new Error(errorMessage)
  }

  return (await response.json()) as PurchaseRequestResponse
}

const createInvoiceReal = async (
  payload: CreatePurchaseRequestPayload,
): Promise<PurchaseRequestResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/purchase-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let errorMessage = `Real API failed (${response.status})`
    try {
      const errorBody = (await response.json()) as { message?: string; error?: string }
      errorMessage = errorBody.message ?? errorBody.error ?? errorMessage
    } catch {
      // keep default message when response is not JSON
    }
    throw new Error(errorMessage)
  }

  return (await response.json()) as PurchaseRequestResponse
}

const getInvoicesReal = async (): Promise<InvoiceItem[]> => {
  const response = await fetch(`${API_BASE_URL}/api/purchase-requests`)

  if (!response.ok) {
    let errorMessage = `Real API failed (${response.status})`
    try {
      const errorBody = (await response.json()) as { message?: string; error?: string }
      errorMessage = errorBody.message ?? errorBody.error ?? errorMessage
    } catch {
      // keep default message when response is not JSON
    }
    throw new Error(errorMessage)
  }

  return (await response.json()) as InvoiceItem[]
}

const getOpenPurchaseRequestsReal = async (): Promise<InvoiceItem[]> => {
  const response = await fetch(`${API_BASE_URL}/api/purchase-requests/open`)

  if (!response.ok) {
    let errorMessage = `Real API failed (${response.status})`
    try {
      const errorBody = (await response.json()) as { message?: string; error?: string }
      errorMessage = errorBody.message ?? errorBody.error ?? errorMessage
    } catch {
      // keep default message when response is not JSON
    }
    throw new Error(errorMessage)
  }

  return (await response.json()) as InvoiceItem[]
}

const getBillsReal = async (): Promise<BillItem[]> => {
  const response = await fetch(`${API_BASE_URL}/api/bills`)

  if (!response.ok) {
    let errorMessage = `Real API failed (${response.status})`
    try {
      const errorBody = (await response.json()) as { message?: string; error?: string }
      errorMessage = errorBody.message ?? errorBody.error ?? errorMessage
    } catch {
      // keep default message when response is not JSON
    }
    throw new Error(errorMessage)
  }

  return (await response.json()) as BillItem[]
}

const createBillReal = async (payload: CreateBillPayload): Promise<CreateBillResponse> => {
  const formData = new FormData()
  formData.append('invoiceId', String(payload.invoiceId))
  formData.append('totalAmount', String(payload.totalAmount))
  formData.append('deadline', payload.deadline)
  if (payload.file) {
    formData.append('file', payload.file)
  }

  const response = await fetch(`${API_BASE_URL}/api/bills`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    let errorMessage = `Real API failed (${response.status})`
    try {
      const errorBody = (await response.json()) as { message?: string; error?: string }
      errorMessage = errorBody.message ?? errorBody.error ?? errorMessage
    } catch {
      // keep default message when response is not JSON
    }
    throw new Error(errorMessage)
  }

  return (await response.json()) as CreateBillResponse
}

const confirmPaidReal = async (invoiceId: number): Promise<ConfirmPaidResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/purchase-requests/${invoiceId}/confirm-paid`, {
    method: 'PATCH',
  })

  if (!response.ok) {
    let errorMessage = `Real API failed (${response.status})`
    try {
      const errorBody = (await response.json()) as { message?: string; error?: string }
      errorMessage = errorBody.message ?? errorBody.error ?? errorMessage
    } catch {
      // keep default message when response is not JSON
    }
    throw new Error(errorMessage)
  }

  const data = (await response.json()) as { id: number; status: string }
  return {
    id: data.id,
    status: data.status,
  }
}

const deleteBillReal = async (billId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/bills/${billId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    let errorMessage = `Real API failed (${response.status})`
    try {
      const errorBody = (await response.json()) as { message?: string; error?: string }
      errorMessage = errorBody.message ?? errorBody.error ?? errorMessage
    } catch {
      // keep default message when response is not JSON
    }
    throw new Error(errorMessage)
  }
}

export const createPurchaseRequest = async (
  payload: CreatePurchaseRequestPayload,
): Promise<PurchaseRequestResponse> => {
  return createPurchaseRequestReal(payload)
}

export const getApiMode = (): ApiMode => API_MODE

export const getInvoices = async (): Promise<InvoiceItem[]> => {
  return getInvoicesReal()
}

export const getOpenPurchaseRequests = async (): Promise<InvoiceItem[]> => {
  return getOpenPurchaseRequestsReal()
}

export const createInvoice = async (
  payload: CreatePurchaseRequestPayload,
): Promise<PurchaseRequestResponse> => {
  return createInvoiceReal(payload)
}

export const getBills = async (): Promise<BillItem[]> => {
  return getBillsReal()
}

export const createBill = async (payload: CreateBillPayload): Promise<CreateBillResponse> => {
  return createBillReal(payload)
}

export const confirmPaid = async (invoiceId: number): Promise<ConfirmPaidResponse> => {
  return confirmPaidReal(invoiceId)
}

export const deleteBill = async (billId: number): Promise<void> => {
  return deleteBillReal(billId)
}
