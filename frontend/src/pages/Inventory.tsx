import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getApiErrorMessage } from '../api/errors'
import { createProduct, fetchProducts } from '../api/products'
import { FormField, Modal, NumberInput, SubmitBar } from '../components/forms'
import { useI18n } from '../i18n'

type ProductFormValues = {
  name: string
  sale_price: string
  purchase_price: string
  current_stock: string
}

export function InventoryPage() {
  const { t } = useI18n()
  const productSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t('pages.inventory.validation.name')),
        sale_price: z
          .string()
          .trim()
          .min(1, t('pages.inventory.validation.sale.required'))
          .refine((value) => Number(value) > 0, t('pages.inventory.validation.sale.positive')),
        purchase_price: z
          .string()
          .trim()
          .min(1, t('pages.inventory.validation.purchase.required'))
          .refine(
            (value) => Number(value) >= 0,
            t('pages.inventory.validation.purchase.nonnegative'),
          ),
        current_stock: z
          .string()
          .trim()
          .min(1, t('pages.inventory.validation.stock.required'))
          .refine(
            (value) => Number.isInteger(Number(value)),
            t('pages.inventory.validation.stock.integer'),
          )
          .refine(
            (value) => Number(value) >= 0,
            t('pages.inventory.validation.stock.nonnegative'),
          ),
      }),
    [t],
  )
  const queryClient = useQueryClient()
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const errorMessage = error ? getApiErrorMessage(error, t('pages.inventory.error.load')) : null
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sale_price: '0',
      purchase_price: '0',
      current_stock: '0',
    },
  })

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      setSuccessMessage(t('pages.inventory.success'))
      setCreateOpen(false)
      reset()
    },
  })

  const createError = createMutation.error
    ? getApiErrorMessage(createMutation.error, t('pages.inventory.error.create'))
    : null

  const onOpenCreate = () => {
    setSuccessMessage(null)
    setCreateOpen(true)
  }

  const onCloseCreate = () => {
    setCreateOpen(false)
    createMutation.reset()
    reset()
  }

  const onSubmit = (values: ProductFormValues) => {
    createMutation.mutate({
      name: values.name.trim(),
      sale_price: Number(values.sale_price),
      purchase_price: Number(values.purchase_price),
      current_stock: Number(values.current_stock),
    })
  }

  return (
    <section className="data-section">
      <div className="section-head">
        <h2 className="section-title">{t('pages.inventory.title')}</h2>
        <button type="button" className="btn" onClick={onOpenCreate}>
          {t('pages.inventory.add')}
        </button>
      </div>
      {successMessage ? <p className="inline-feedback">{successMessage}</p> : null}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('common.product')}</th>
              <th>{t('pages.inventory.stock')}</th>
              <th>{t('pages.inventory.unitPrice')}</th>
              <th>{t('common.status')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5}>{t('pages.inventory.loading')}</td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td colSpan={5} className="table-error">
                  {errorMessage}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5}>{t('pages.inventory.empty')}</td>
              </tr>
            ) : (
              data.map((row) => {
                const status = row.current_stock <= 10 ? 'low-stock' : 'in-stock'
                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.current_stock}</td>
                    <td>${Number(row.sale_price ?? 0).toFixed(2)}</td>
                    <td>
                      <span className={`pill pill-${status}`}>
                        {status === 'low-stock'
                          ? t('pages.inventory.status.low')
                          : t('pages.inventory.status.in')}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isCreateOpen} title={t('pages.inventory.modal.title')} onClose={onCloseCreate}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField htmlFor="product-name" label={t('common.name')} error={errors.name?.message} required>
            <input id="product-name" className="field-input" {...register('name')} />
          </FormField>

          <FormField
            htmlFor="product-sale-price"
            label={t('pages.inventory.salePrice')}
            error={errors.sale_price?.message}
            required
          >
            <NumberInput
              id="product-sale-price"
              step="0.01"
              min="0"
              {...register('sale_price')}
            />
          </FormField>

          <FormField
            htmlFor="product-purchase-price"
            label={t('pages.inventory.purchasePrice')}
            error={errors.purchase_price?.message}
            required
          >
            <NumberInput
              id="product-purchase-price"
              step="0.01"
              min="0"
              {...register('purchase_price')}
            />
          </FormField>

          <FormField
            htmlFor="product-stock"
            label={t('pages.inventory.currentStock')}
            error={errors.current_stock?.message}
            required
          >
            <NumberInput
              id="product-stock"
              step="1"
              min="0"
              {...register('current_stock')}
            />
          </FormField>

          {createError ? <p className="field-error">{createError}</p> : null}

          <SubmitBar
            isSubmitting={createMutation.isPending}
            submitLabel={t('pages.inventory.submit')}
            submittingLabel={t('pages.inventory.submitting')}
            cancelLabel={t('common.cancel')}
            onCancel={onCloseCreate}
          />
        </form>
      </Modal>
    </section>
  )
}
