import { useEffect, useState } from 'react'
import { ChevronDown, Pencil, Trash2, X, AlertCircle } from 'lucide-react'
import { confirmPaid, deleteBill, getApiMode, getBills, updateBill } from '../api/purchaseRequestApi'
import type { BillItem } from '../mocks/purchaseRequestMockApi'

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })

const PaymentQueue = () => {
  const [payments, setPayments] = useState<BillItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmingInvoiceIds, setConfirmingInvoiceIds] = useState<number[]>([])
  const [deletingBillIds, setDeletingBillIds] = useState<number[]>([])
  const [deletingItem, setDeletingItem] = useState<BillItem | null>(null)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BillItem | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)

  const fetchBills = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const data = await getBills()
      setPayments(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Khong the tai hoa don. Vui long thu lai.'
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchBills()
  }, [])

  const handleConfirmPaid = async (invoiceId: number) => {
    setErrorMessage('')
    setConfirmingInvoiceIds((prev) => [...prev, invoiceId])

    try {
      const result = await confirmPaid(invoiceId)
      setPayments((prev) =>
        prev.map((item) =>
          item.invoiceId === invoiceId ? { ...item, invoiceStatus: result.status } : item,
        ),
      )
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Khong the xac nhan thanh toan. Vui long thu lai.'
      setErrorMessage(message)
    } finally {
      setConfirmingInvoiceIds((prev) => prev.filter((id) => id !== invoiceId))
    }
  }

  const handleDeleteBill = async (billId: number) => {
    setErrorMessage('')
    setDeletingBillIds((prev) => [...prev, billId])

    try {
      await deleteBill(billId)
      setPayments((prev) => prev.filter((item) => item.id !== billId))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Khong the xoa hoa don. Vui long thu lai.'
      setErrorMessage(message)
    } finally {
      setDeletingBillIds((prev) => prev.filter((id) => id !== billId))
    }
  }

  const openDeleteModal = (item: BillItem) => {
    setDeletingItem(item)
  }

  const closeDeleteModal = () => {
    if (deletingItem && deletingBillIds.includes(deletingItem.id)) {
      return
    }
    setDeletingItem(null)
  }

  const confirmDelete = async () => {
    if (!deletingItem) return
    const billId = deletingItem.id
    await handleDeleteBill(billId)
    setDeletingItem(null)
  }

  const openEditModal = (item: BillItem) => {
    setEditingItem({ ...item })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return
    if (!editingItem.customerName.trim() || editingItem.totalAmount <= 0) {
      setErrorMessage('Thong tin sua khong hop le.')
      return
    }

    setSavingEdit(true)
    setErrorMessage('')
    try {
      const updated = await updateBill(editingItem.id, {
        customerName: editingItem.customerName.trim(),
        totalAmount: editingItem.totalAmount,
        invoiceStatus: editingItem.invoiceStatus,
      })
      setPayments((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      setIsEditModalOpen(false)
      setEditingItem(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Khong the cap nhat hoa don. Vui long thu lai.'
      setErrorMessage(message)
    } finally {
      setSavingEdit(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#d1d9e2] p-8 font-sans text-[#1a2b4b]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black mb-1 tracking-tighter uppercase">Hoa don thanh toan</h1>
            <p className="text-gray-600 text-sm italic">Che do API: {getApiMode()}</p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-md text-sm font-semibold shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
              Tat ca trang thai <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {loading && <div className="bg-white/50 p-4 rounded-xl animate-pulse text-center">Dang tai du lieu...</div>}
        {errorMessage && (
          <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} /> {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && (
          <div className="mt-4">
            <div className="grid grid-cols-12 px-6 mb-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              <div className="col-span-2">Ma giao dich</div>
              <div className="col-span-3">Nha cung cap</div>
              <div className="col-span-2 text-center">Thanh tien</div>
              <div className="col-span-2 text-center">Han thanh toan</div>
              <div className="col-span-1 text-center">Trang thai</div>
              <div className="col-span-2 text-right">Thao tac</div>
            </div>

            <div className="space-y-4">
              {payments.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center bg-[#aeb9c7] hover:bg-[#a4b0bf] transition-all p-6 rounded-2xl shadow-sm border border-transparent hover:border-white/20"
                >
                  <div className="col-span-2 font-bold text-xs tracking-tight">{item.invoiceNumber}</div>
                  <div className="col-span-3 font-bold text-sm truncate pr-4">{item.customerName}</div>
                  <div className="col-span-2 text-center font-black text-lg">{formatCurrency(item.totalAmount)}</div>
                  <div className="col-span-2 text-center text-sm font-medium">{formatDate(item.deadline)}</div>
                  <div className="col-span-1 flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-tighter bg-[#ced7e0] text-[#4b5563] uppercase">
                      {item.invoiceStatus}
                    </span>
                  </div>

                  <div className="col-span-2 flex justify-end items-center gap-4">
                    <button
                      onClick={() => handleConfirmPaid(item.invoiceId)}
                      disabled={
                        item.invoiceStatus !== 'Awaiting Payment' ||
                        confirmingInvoiceIds.includes(item.invoiceId)
                      }
                      className="bg-[#0f172a] text-white text-[10px] font-bold py-2 px-4 rounded-lg hover:bg-black transition-colors uppercase cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {confirmingInvoiceIds.includes(item.invoiceId) ? 'Dang xac nhan...' : 'Xac nhan'}
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 hover:bg-blue-100/30 rounded-full text-[#1a2b4b] transition-colors cursor-pointer"
                      title="Sua"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(item)}
                      disabled={deletingBillIds.includes(item.id)}
                      className="p-2 hover:bg-red-100/30 rounded-full text-red-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
                      title="Xoa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-black text-[#0f172a] uppercase tracking-tight">Chinh sua thong tin</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nha cung cap</label>
                <input
                  type="text"
                  value={editingItem.customerName}
                  onChange={(e) => setEditingItem({ ...editingItem, customerName: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">So tien (VND)</label>
                <input
                  type="number"
                  value={editingItem.totalAmount}
                  onChange={(e) => setEditingItem({ ...editingItem, totalAmount: Number(e.target.value) })}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none font-bold text-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Trang thai</label>
                <div className="relative">
                  <select
                    value={editingItem.invoiceStatus}
                    onChange={(e) => setEditingItem({ ...editingItem, invoiceStatus: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none font-semibold cursor-pointer"
                  >
                    <option value="Awaiting Payment">Awaiting Payment (Cho duyet)</option>
                    <option value="Completed/Invoiced">Completed/Invoiced (Da thanh toan)</option>
                    <option value="Cancelled">Cancelled (Huy bo)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex gap-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                disabled={savingEdit}
                className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-200 rounded-2xl transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                HUY
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="flex-1 py-4 bg-[#0f172a] text-white font-bold rounded-2xl hover:bg-black shadow-lg shadow-blue-900/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {savingEdit ? 'DANG LUU...' : 'LUU THONG TIN'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-black text-[#0f172a] uppercase tracking-tight">Xac nhan xoa bill</h2>
              <button onClick={closeDeleteModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <p className="text-sm text-gray-700 leading-relaxed">
                Ban co chac muon xoa bill <span className="font-black text-[#0f172a]">{deletingItem.invoiceNumber}</span>?
              </p>
              <p className="text-xs text-gray-500 mt-3">Hanh dong nay se xoa bill khoi danh sach thanh toan.</p>
            </div>

            <div className="p-6 bg-gray-50 flex gap-4">
              <button
                onClick={closeDeleteModal}
                disabled={deletingBillIds.includes(deletingItem.id)}
                className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-200 rounded-2xl transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                HUY
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingBillIds.includes(deletingItem.id)}
                className="flex-1 py-4 bg-red-700 text-white font-bold rounded-2xl hover:bg-red-800 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deletingBillIds.includes(deletingItem.id) ? 'DANG XOA...' : 'XOA BILL'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentQueue
