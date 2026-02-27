import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import { getApiErrorMessage } from '../api/errors'
import { createInvoice, fetchInvoices } from '../api/invoices'
import { fetchParties } from '../api/parties'
import { fetchProducts } from '../api/products'
import { useAuth } from '../auth/AuthContext'
import { FormField, Modal, NumberInput, SelectField, SubmitBar } from '../components/forms'
import { useI18n } from '../i18n'

type InvoiceFormValues = {
  type: 'SALE' | 'PURCHASE' | 'INTERNAL'
  invoice_date: string
  status: 'PAID' | 'UNPAID'
  party_id?: string
  notes?: string
  items: Array<{
    product_id: string
    qty: string
  }>
}

export function InvoicesPage() {
  const { t } = useI18n()
  const invoiceSchema = useMemo(
    () =>
      z.object({
        type: z.enum(['SALE', 'PURCHASE', 'INTERNAL']),
        invoice_date: z.string().min(1, t('pages.invoices.validation.invoiceDate')),
        status: z.enum(['PAID', 'UNPAID']),
        party_id: z.string().optional(),
        notes: z.string().optional(),
        items: z
          .array(
            z.object({
              product_id: z.string().min(1, t('pages.invoices.validation.product')),
              qty: z
                .string()
                .min(1, t('pages.invoices.validation.qty.required'))
                .refine((value) => Number(value) > 0, t('pages.invoices.validation.qty.positive')),
            }),
          )
          .min(1, t('pages.invoices.validation.items')),
      }),
    [t],
  )
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  })
  const { data: parties = [] } = useQuery({
    queryKey: ['parties'],
    queryFn: fetchParties,
  })
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      type: 'SALE',
      invoice_date: new Date().toISOString().slice(0, 10),
      status: 'UNPAID',
      party_id: '',
      notes: '',
      items: [{ product_id: '', qty: '1' }],
    },
  })
  const itemsArray = useFieldArray({
    control,
    name: 'items',
  })

  const createMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['invoices'] })
      setSuccessMessage(t('pages.invoices.success'))
      setCreateOpen(false)
      reset()
    },
  })

  const errorMessage = error ? getApiErrorMessage(error, t('pages.invoices.error.load')) : null
  const createError = createMutation.error
    ? getApiErrorMessage(createMutation.error, t('pages.invoices.error.create'))
    : null

  const openCreate = () => {
    setSuccessMessage(null)
    setCreateOpen(true)
  }

  const closeCreate = () => {
    setCreateOpen(false)
    createMutation.reset()
    reset()
  }

  const onSubmit = (values: InvoiceFormValues) => {
    if (!user?.id) {
      return
    }

    createMutation.mutate({
      type: values.type,
      invoice_date: values.invoice_date,
      status: values.status,
      notes: values.notes?.trim() ? values.notes.trim() : null,
      party_id: values.party_id ? Number(values.party_id) : null,
      created_by: user.id,
      items: values.items.map((item) => ({
        product_id: Number(item.product_id),
        qty: Number(item.qty),
      })),
    })
  }

  return (
    <section className="data-section">
      <div className="section-head">
        <h2 className="section-title">{t('pages.invoices.title')}</h2>
        <button type="button" className="btn" onClick={openCreate}>
          {t('pages.invoices.create')}
        </button>
      </div>
      {successMessage ? <p className="inline-feedback">{successMessage}</p> : null}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('pages.invoices.table.invoice')}</th>
              <th>{t('pages.invoices.table.partyId')}</th>
              <th>{t('pages.invoices.table.amount')}</th>
              <th>{t('common.status')}</th>
              <th>{t('pages.invoices.table.dueDate')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5}>{t('pages.invoices.loading')}</td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td colSpan={5} className="table-error">
                  {errorMessage}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5}>{t('pages.invoices.empty')}</td>
              </tr>
            ) : (
              data.map((row) => {
                const statusRaw = (row.status || '').toUpperCase()
                const statusLabel =
                  statusRaw === 'PAID'
                    ? t('pages.invoices.status.paid')
                    : statusRaw === 'UNPAID'
                      ? t('pages.invoices.status.unpaid')
                      : t('pages.invoices.table.na')
                const statusClass =
                  statusRaw === 'PAID' ? 'paid' : statusRaw === 'UNPAID' ? 'unpaid' : 'unknown'
                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.party_id ?? '-'}</td>
                    <td>${Number(row.total ?? 0).toFixed(2)}</td>
                    <td>
                      <span className={`pill pill-${statusClass}`}>{statusLabel}</span>
                    </td>
                    <td>{row.invoice_date ? row.invoice_date.slice(0, 10) : '-'}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isCreateOpen} title={t('pages.invoices.modal.title')} onClose={closeCreate}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField htmlFor="invoice-type" label={t('common.type')} error={errors.type?.message} required>
            <SelectField
              id="invoice-type"
              options={[
                { value: 'SALE', label: t('pages.invoices.type.sale') },
                { value: 'PURCHASE', label: t('pages.invoices.type.purchase') },
                { value: 'INTERNAL', label: t('pages.invoices.type.internal') },
              ]}
              {...register('type')}
            />
          </FormField>

          <FormField
            htmlFor="invoice-date"
            label={t('pages.invoices.invoiceDate')}
            error={errors.invoice_date?.message}
            required
          >
            <input id="invoice-date" type="date" className="field-input" {...register('invoice_date')} />
          </FormField>

          <FormField htmlFor="invoice-status" label={t('common.status')} error={errors.status?.message} required>
            <SelectField
              id="invoice-status"
              options={[
                { value: 'UNPAID', label: t('pages.invoices.status.unpaid') },
                { value: 'PAID', label: t('pages.invoices.status.paid') },
              ]}
              {...register('status')}
            />
          </FormField>

          <FormField htmlFor="invoice-party" label={t('pages.invoices.party')}>
            <SelectField
              id="invoice-party"
              options={[
                { value: '', label: t('pages.invoices.noParty') },
                ...parties.map((party) => ({
                  value: String(party.id),
                  label: `${party.name} (${party.type})`,
                })),
              ]}
              {...register('party_id')}
            />
          </FormField>

          <FormField htmlFor="invoice-notes" label={t('common.notes')}>
            <textarea id="invoice-notes" className="field-input" rows={3} {...register('notes')} />
          </FormField>

          <div className="invoice-items-head">
            <h4 className="invoice-items-title">{t('common.items')}</h4>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => itemsArray.append({ product_id: '', qty: '1' })}
            >
              {t('common.addItem')}
            </button>
          </div>

          {itemsArray.fields.map((field, index) => (
            <div className="invoice-item-row" key={field.id}>
              <FormField
                htmlFor={`invoice-item-product-${index}`}
                label={`${t('common.product')} ${index + 1}`}
                error={errors.items?.[index]?.product_id?.message}
                required
              >
                <SelectField
                  id={`invoice-item-product-${index}`}
                  placeholder={t('pages.invoices.selectProduct')}
                  options={products.map((product) => ({
                    value: String(product.id),
                    label: `${product.name} ($${Number(product.sale_price ?? 0).toFixed(2)})`,
                  }))}
                  {...register(`items.${index}.product_id`)}
                />
              </FormField>

              <FormField
                htmlFor={`invoice-item-qty-${index}`}
                label={t('common.qty')}
                error={errors.items?.[index]?.qty?.message}
                required
              >
                <NumberInput
                  id={`invoice-item-qty-${index}`}
                  min="0.01"
                  step="0.01"
                  {...register(`items.${index}.qty`)}
                />
              </FormField>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => itemsArray.remove(index)}
                disabled={itemsArray.fields.length <= 1}
              >
                {t('common.remove')}
              </button>
            </div>
          ))}
          {errors.items?.message ? <p className="field-error">{errors.items.message}</p> : null}

          {createError ? <p className="field-error">{createError}</p> : null}

          <SubmitBar
            isSubmitting={createMutation.isPending}
            submitLabel={t('pages.invoices.submit')}
            submittingLabel={t('pages.invoices.submitting')}
            cancelLabel={t('common.cancel')}
            onCancel={closeCreate}
          />
        </form>
      </Modal>
    </section>
  )
}
