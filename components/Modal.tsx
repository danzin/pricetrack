"use client"
import { FormEvent, Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image';
import { addUserToProduct } from '@/lib/actions';

interface MProps {
 productId: string;
}

const Modal = ({productId}: MProps) => {
  let [isOpen, setIsOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  
  const toggleModal = () => setIsOpen(isOpen => !isOpen);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await addUserToProduct(productId, email)
    setIsSubmitting(false);
    setEmail('');
    toggleModal()
  }

  return (
    <>
      
      <button type='button' className='btn' onClick={toggleModal}>
        Track
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' onClose={toggleModal} className='dialog-container'>
        <div className='min-h-screen px-4 text-center'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-200'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-110'
            leaveTo='opacity-0'
          >
              <Dialog.Overlay className='fixed inset-0'/>

          </Transition.Child>

          <span className='inline-block h-screen align-middle' aria-hidden='true'/>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-200'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className='dialog-content'>
              <div className='flex flex-col'>
                <div className='flex justify-between'>
                  <div className='p-3 border border-gray-200 rounded-10'>
                  <Image 
                    src='/assets/icons/logo.svg'
                    alt='logo'
                    width={28}
                    height={28}
                  />
                  </div>

                  <Image 
                    src='/assets/icons/x-close.svg'
                    alt='close'
                    width={24}
                    height={24}
                    className='cursor-pointer'
                    onClick={toggleModal}
                  />
                </div>

                <h4 className='dialog-head_text'>
                 Stay in the loop with email alerts on price changes.
                </h4>
                <p className='text-sm text-gray-400 mt-2'>Receive email notifications for price drops and special offers.</p>
              </div>
              <form className='flex flex-col mt-5' onSubmit={handleSubmit}>
                <label htmlFor="email" className='text-sm font-medium text-gray-700'>
                  Email address
                </label>
                <div className='dialog-input_container'>
                  <Image
                    src='/assets/icons/mail.svg' 
                    alt='mail'
                    width={18}
                    height={18}
                  />
                  <input required type='email' id='email' placeholder='email@address.com' className='dialog-input' value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <button type='submit' className='dialog-btn'>
                  {isSubmitting ? 'Submitting...' : 'Track' }

                </button>
              </form>
              
            </div>    
          </Transition.Child>
        </div>
        </Dialog>
      </Transition>
      
    </>
  )
}

export default Modal