import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Loader from '../loader/loader';
import translations from '../../constants/en.global.json';
import Button from '../button/button';
import ImageSlider from '../sliders/ImageSlider';

interface createUserPopupProps {
  createUser: (name: string, bio: string, image: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function createUserPopup({
  createUser,
  open,
  setOpen,
}: createUserPopupProps) {
  const t = translations.postPopup;
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const imageUrls = [
    'https://avatar.iran.liara.run/public/39',
    'https://avatar.iran.liara.run/public/50',
    'https://avatar.iran.liara.run/public/97',
    'https://avatar.iran.liara.run/public/81',
    // Add more URLs if needed
  ];
  const [selectedImage, setSelectedImage] = useState(0); // Track the selected image

  // Function to handle image selection
  const handleImageSelect = (index) => {
    setSelectedImage(index === selectedImage ? null : index); // Toggle selection
  };

  const onCreateUser = () => {
    setLoading(true);
    createUser(name, bio, imageUrls[selectedImage]);
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#1c2123] px-4 pb-4 pt-5 text-left shadow-xl transition-all">
                {loading ? (
                  <div>
                    <div className="text-lg font-semibold leading-6 text-white text-center pb-4">
                      {t.loadingText}
                    </div>
                    <Loader />
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="text-center">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-semibold leading-6 text-white"
                        >
                          {'Register User'}
                        </Dialog.Title>
                        <label className="block mb-2 text-white text-start">
                          {'Name'}
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 mb-4 rounded-md outline-none bg-black text-white"
                          value={name}
                          placeholder={'name'}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <label className="block mb-2 text-white text-start">
                          {'Profile'}
                        </label>

                        <div className="flex justify-center mt-2">
                          <ImageSlider
                            imageUrls={imageUrls}
                            selectedImage={selectedImage}
                            onSelect={handleImageSelect}
                          />
                        </div>
                        <label className="block mb-2 text-white text-start">
                          {'Bio'}
                        </label>
                        <div className="relative">
                          <textarea
                            className="w-full px-3 py-2 rounded-md resize-none outline-none bg-black text-white"
                            rows={6}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder={'Bio..'}
                          ></textarea>
                          <div className="text-gray-500 text-sm absolute bottom-2 right-2">
                            {bio.length}
                            {t.maxCharLength}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center mt-2">
                      {/* <Button
                        title={"Back"}
                        backgroundColor="bg-[#B67352]"
                        backgroundColorHover=""
                        onClick={() => setOpen(false)}
                      /> */}
                      <Button
                        title={'Register'}
                        backgroundColor="bg-[#ECB159]"
                        backgroundColorHover={`${
                          name.trim() === '' ||
                          bio.trim() === '' ||
                          bio.length > 250
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                        disabled={
                          name.trim() === '' ||
                          bio.trim() === '' ||
                          bio.length > 250
                        }
                        onClick={() => onCreateUser()}
                      />
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
