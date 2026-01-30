'use client';
import { Pencil, Trash2 } from "lucide-react";

export default function TableActions({ onEdit, onDelete, label = "registro" }) {
    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={onEdit}
                title={`Editar ${label}`}
                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all active:scale-90 cursor-pointer"
            >
                <Pencil size={18} />
            </button>

            <button
                onClick={onDelete}
                title={`Excluir ${label}`}
                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all active:scale-90 cursor-pointer"
            >
                <Trash2 size={18} />
            </button>
        </div>
    )
}