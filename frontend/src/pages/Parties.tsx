import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getApiErrorMessage } from '../api/errors'
import { createParty, fetchParties } from '../api/parties'
import { FormField, Modal, SelectField, SubmitBar } from '../components/forms'
import { useI18n } from '../i18n'

type PartyFormValues = {
  name: string
  type: 'CUSTOMER' | 'SUPPLIER'
  phone: string
  address: string
}

export function PartiesPage() {
  const { t } = useI18n()
  const partyFormSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t('pages.parties.validation.name')),
        type: z.enum(['CUSTOMER', 'SUPPLIER']),
        phone: z.string().trim().min(7, t('pages.parties.validation.phone')),
        address: z.string().trim().min(4, t('pages.parties.validation.address')),
      }),
    [t],
  )
  const queryClient = useQueryClient()
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['parties'],
    queryFn: fetchParties,
  })

  const errorMessage = error ? getApiErrorMessage(error, t('pages.parties.error.load')) : null
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartyFormValues>({
    resolver: zodResolver(partyFormSchema),
    defaultValues: {
      name: '',
      type: 'CUSTOMER',
      phone: '',
      address: '',
    },
  })

  const createMutation = useMutation({
    mutationFn: createParty,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['parties'] })
      setSuccessMessage(t('pages.parties.success'))
      setCreateOpen(false)
      reset()
    },
  })

  const createError = createMutation.error
    ? getApiErrorMessage(createMutation.error, t('pages.parties.error.create'))
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

  const onSubmit = (values: PartyFormValues) => {
    createMutation.mutate(values)
  }

  return (
    <section className="data-section">
      <div className="section-head">
        <h2 className="section-title">{t('pages.parties.title')}</h2>
        <button type="button" className="btn" onClick={onOpenCreate}>
          {t('pages.parties.add')}
        </button>
      </div>
      {successMessage ? <p className="inline-feedback">{successMessage}</p> : null}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('common.name')}</th>
              <th>{t('common.type')}</th>
              <th>{t('common.phone')}</th>
              <th>{t('common.address')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5}>{t('pages.parties.loading')}</td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td colSpan={5} className="table-error">
                  {errorMessage}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5}>{t('pages.parties.empty')}</td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>
                    {row.type === 'CUSTOMER'
                      ? t('pages.parties.type.customer')
                      : row.type === 'SUPPLIER'
                        ? t('pages.parties.type.supplier')
                        : row.type}
                  </td>
                  <td>{row.phone || '-'}</td>
                  <td>{row.address || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isCreateOpen} title={t('pages.parties.modal.title')} onClose={onCloseCreate}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField htmlFor="party-name" label={t('common.name')} error={errors.name?.message} required>
            <input id="party-name" className="field-input" {...register('name')} />
          </FormField>

          <FormField htmlFor="party-type" label={t('common.type')} error={errors.type?.message} required>
            <SelectField
              id="party-type"
              options={[
                { value: 'CUSTOMER', label: t('pages.parties.type.customer') },
                { value: 'SUPPLIER', label: t('pages.parties.type.supplier') },
              ]}
              {...register('type')}
            />
          </FormField>

          <FormField htmlFor="party-phone" label={t('common.phone')} error={errors.phone?.message} required>
            <input id="party-phone" className="field-input" {...register('phone')} />
          </FormField>

          <FormField
            htmlFor="party-address"
            label={t('common.address')}
            error={errors.address?.message}
            required
          >
            <input id="party-address" className="field-input" {...register('address')} />
          </FormField>

          {createError ? <p className="field-error">{createError}</p> : null}

          <SubmitBar
            isSubmitting={createMutation.isPending}
            submitLabel={t('pages.parties.submit')}
            submittingLabel={t('pages.parties.submitting')}
            cancelLabel={t('common.cancel')}
            onCancel={onCloseCreate}
          />
        </form>
      </Modal>
    </section>
  )
}
