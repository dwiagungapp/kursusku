import { useNavigate } from 'react-router-dom'

type Props = {
  onDelete: () => void
  onEdit: () => void
}

export default function ActionButtons({ onDelete, onEdit }: Props) {
  return (
    <div className="flex items-center space-x-2">
      <button onClick={onEdit} className="text-blue-600 text-sm font-medium hover:underline">
        Edit
      </button>
      <button
        onClick={() => {
          if (confirm('Yakin ingin menghapus item ini?')) onDelete()
        }}
        className="text-red-600 text-sm font-medium hover:underline"
      >
        Hapus
      </button>
    </div>
  )
}
