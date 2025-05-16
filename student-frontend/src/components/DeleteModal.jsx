import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function DeleteModal({ student, onCancel, onConfirm }) {
  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onCancel}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="ease-in duration-200"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <Dialog.Panel className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
                <Dialog.Title className="text-lg font-medium">
                  Confirm Delete
                </Dialog.Title>
                <div className="mt-2">
                  Are you sure you want to delete{" "}
                  <strong>{student.name}</strong>?
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="px-4 py-2 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
