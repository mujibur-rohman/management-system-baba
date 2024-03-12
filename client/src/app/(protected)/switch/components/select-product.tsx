import { Button } from "@/components/ui/button";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowDownUpIcon, CheckIcon } from "lucide-react";
import React from "react";

function SelectProduct({ products, setValue, value }: { products: ProductTypes[]; value: string; setValue: React.Dispatch<React.SetStateAction<string>> }) {
  const [open, setOpen] = React.useState(false);

  const mapping = products.map((prod) => ({
    value: prod.codeProduct,
    label: `${prod.aromaLama} / ${prod.aromaBaru}`,
    stock: prod.stock,
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full">
          <>
            {value ? mapping.find((prod) => prod.value === value.toUpperCase())?.label : "Pilih aroma..."}
            <ArrowDownUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[300px] w-full p-0">
        <Command>
          <CommandInput placeholder="Cari aroma..." className="h-9" />
          <CommandList>
            <CommandEmpty>Aroma tidak ditemukan.</CommandEmpty>
            <CommandGroup className="overflow-auto">
              {mapping.map((prod) => (
                <CommandItem
                  key={prod.value}
                  value={prod.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className={cn(value.toUpperCase() === prod.value ? "bg-blue-500 text-white" : "")}
                >
                  {prod.label} (Stok: {prod.stock})
                  <CheckIcon className={cn("ml-auto h-4 w-4", value.toUpperCase() === prod.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SelectProduct;
