import type { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";

import { ArrowLeft, Search } from "lucide-react";

type SearchProps = { query: string };

interface SearchBarProps {
  readonly hasSearchBar: boolean;
  readonly setHasSearchBar: (value: boolean) => void;
  readonly handleSubmit: UseFormHandleSubmit<SearchProps>;
  readonly register: UseFormRegister<SearchProps>;
  readonly submitSearch: (data: SearchProps) => void;
}

export function SearchBar({
  hasSearchBar,
  setHasSearchBar,
  handleSubmit,
  register,
  submitSearch,
}: SearchBarProps) {
  return (
    <Dialog.Root open={hasSearchBar} onOpenChange={setHasSearchBar}>
      <Dialog.Trigger
        asChild
        className="flex size-full items-center justify-center self-end rounded-3xl md:hidden"
      >
        <button
          type="button"
          className="p-3 outline-purple-400 duration-200"
          title="Buscar"
          aria-label="Buscar"
        >
          <Search />
        </button>
      </Dialog.Trigger>
      <AnimatePresence>
        {hasSearchBar ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-0 z-[9999] h-14 w-full sm:h-16">
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="size-full"
                onSubmit={handleSubmit(submitSearch)}
              >
                <div className="flex size-full bg-zinc-800">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="flex items-center px-3 py-2 outline-purple-400"
                      title="Voltar"
                      aria-label="Voltar"
                    >
                      <ArrowLeft />
                    </button>
                  </Dialog.Close>
                  <div className="w-full py-2 pr-4">
                    <div className="flex w-full rounded-3xl bg-zinc-700">
                      <input
                        type="text"
                        placeholder="Buscar videos..."
                        className="w-full rounded-l-3xl bg-transparent px-3 py-2 outline-none duration-200 focus:border-purple-400"
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus={hasSearchBar}
                        {...register("query")}
                      />
                      <button
                        type="submit"
                        className="rounded-r-3xl px-4 py-2 outline-purple-400 duration-200"
                        title="Buscar"
                        aria-label="Buscar"
                      >
                        <Search className="mr-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.form>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
