import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import ImageUploader from "../../components/admin/ImageUploader";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ColorVariant = {
  colorName: string;
  colorCode?: string;
  imageIndexes: number[];
};

interface ProductFormProps {
  onSubmit: (product: any) => void;
  categories: { id: string; name: string }[];
  cloudinaryOptions: { name: string; endpoint: string }[];
  initialData?: {
    name?: string;
    description?: string;
    price?: number | string;
    discounted_price?: number | string | null;
    deliveryCharge?: number | string | null;
    categoryId?: string;
    images?: string[];
    isAvailable?: boolean;
    colorVariants?: ColorVariant[];
    material?: string;
    warrantyMonths?: number | string | null;
    returnPolicy?: string;
  } | null;
  submitLabel?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  categories,
  cloudinaryOptions,
  initialData,
  submitLabel,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(
    initialData?.price !== undefined && initialData?.price !== null
      ? String(initialData.price)
      : ""
  );
  const [discountedPrice, setDiscountedPrice] = useState(
    initialData?.discounted_price !== undefined && initialData?.discounted_price !== null
      ? String(initialData.discounted_price)
      : ""
  );
  const [deliveryCharge, setDeliveryCharge] = useState(
    initialData?.deliveryCharge !== undefined && initialData?.deliveryCharge !== null
      ? String(initialData.deliveryCharge)
      : ""
  );
  const [category, setCategory] = useState(
    initialData?.categoryId || categories[0]?.id || ""
  );
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [isAvailable, setIsAvailable] = useState(initialData?.isAvailable ?? true);
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(
    initialData?.colorVariants || []
  );
  const [material, setMaterial] = useState(initialData?.material || "");
  const [warrantyMonths, setWarrantyMonths] = useState(
    initialData?.warrantyMonths !== undefined && initialData?.warrantyMonths !== null
      ? String(initialData.warrantyMonths)
      : ""
  );
  const [returnPolicy, setReturnPolicy] = useState(initialData?.returnPolicy || "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      toast({
        title: "Error",
        description: "Valid product price is required",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Error",
        description: "At least one product image is required",
        variant: "destructive",
      });
      return;
    }

    if (colorVariants.length > 0) {
      const invalidVariant = colorVariants.some(
        (v) => !v.colorName || !v.colorName.trim()
      );
      if (invalidVariant) {
        toast({
          title: "Error",
          description: "Color name is required for all color variants",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      const productData = {
        name,
        description,
        price,
        discounted_price: discountedPrice || null,
        deliveryCharge: deliveryCharge || null,
        category,
        images,
        isAvailable,
        colorVariants,
        material,
        warrantyMonths,
        returnPolicy,
      };

      await onSubmit(productData);

      // Reset form
      setName(initialData?.name || "");
      setDescription(initialData?.description || "");
      setPrice(
        initialData?.price !== undefined && initialData?.price !== null
          ? String(initialData.price)
          : ""
      );
      setDiscountedPrice(
        initialData?.discounted_price !== undefined && initialData?.discounted_price !== null
          ? String(initialData.discounted_price)
          : ""
      );
      setDeliveryCharge(
        initialData?.deliveryCharge !== undefined && initialData?.deliveryCharge !== null
          ? String(initialData.deliveryCharge)
          : ""
      );
      setCategory(initialData?.categoryId || categories[0]?.id || "");
      setImages(initialData?.images || []);
      setIsAvailable(initialData?.isAvailable ?? true);
      setColorVariants(initialData?.colorVariants || []);
      setMaterial(initialData?.material || "");
      setWarrantyMonths(
        initialData?.warrantyMonths !== undefined && initialData?.warrantyMonths !== null
          ? String(initialData.warrantyMonths)
          : ""
      );
      setReturnPolicy(initialData?.returnPolicy || "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Card className="border-0 shadow-none">
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name *</Label>
              <Input
                id="product-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Elegant Pendant"
                className="h-10"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="product-price">Price (₹) *</Label>
              <Input
                id="product-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min={1}
                step="0.01"
                placeholder="e.g. 999"
                className="h-10"
              />
            </div>

            {/* ⭐ Discounted Price */}
            <div className="space-y-2">
              <Label htmlFor="discounted-price">Discounted Price (₹)</Label>
              <Input
                id="discounted-price"
                type="number"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                min={0}
                step="0.01"
                placeholder="e.g. 799"
                className="h-10"
              />
            </div>

            {/* Delivery Charge */}
            <div className="space-y-2">
              <Label htmlFor="delivery-charge">Delivery Charge (₹)</Label>
              <Input
                id="delivery-charge"
                type="number"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                min={0}
                step="0.01"
                placeholder="e.g. 49 (leave empty for free delivery)"
                className="h-10"
              />
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="product-available"
              checked={isAvailable}
              onCheckedChange={(checked) => setIsAvailable(checked === true)}
            />
            <Label htmlFor="product-available" className="text-sm font-medium">
              Product Available for Sale
            </Label>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="product-description">Description *</Label>
            <Textarea
              id="product-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe the product..."
              className="min-h-[100px] resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="product-material">Material (optional)</Label>
              <Input
                id="product-material"
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Brass, Silver, Wood"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-warranty">Warranty (months)</Label>
              <Input
                id="product-warranty"
                type="number"
                min={0}
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
                placeholder="e.g. 6"
                className="h-10"
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="product-return-policy">Return Policy (optional)</Label>
              <Textarea
                id="product-return-policy"
                value={returnPolicy}
                onChange={(e) => setReturnPolicy(e.target.value)}
                placeholder="e.g. No return, only replacement if damaged on delivery"
                className="min-h-[60px] resize-y"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="product-category">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="product-category" className="h-10">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Product Images *</Label>
            <ImageUploader
              onUpload={(urls) => {
                // Append new images to existing list so variant mappings stay valid
                setImages((prev) => {
                  const nextImages = [...prev, ...urls];
                  return nextImages;
                });
              }}
              cloudinaryOptions={cloudinaryOptions}
            />

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg border border-gray-200 bg-gray-50 overflow-hidden group"
                  >
                    <img
                      src={url}
                      alt={`Product-${idx}`}
                      className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Color Variants (optional) */}
          <div className="space-y-3">
            <Label>Color Variants (optional)</Label>
            <p className="text-xs text-gray-500">
              Define different colors for this product and map them to the uploaded images.
            </p>

            <div className="space-y-4">
              {colorVariants.map((variant, variantIndex) => (
                <div
                  key={variantIndex}
                  className="border border-gray-200 rounded-md p-3 space-y-3 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div className="space-y-1">
                      <Label className="text-xs">Color Name</Label>
                      <Input
                        type="text"
                        value={variant.colorName}
                        onChange={(e) => {
                          const value = e.target.value;
                          setColorVariants((prev) =>
                            prev.map((v, i) =>
                              i === variantIndex ? { ...v, colorName: value } : v
                            )
                          );
                        }}
                        placeholder="e.g. Red"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Color Code (optional)</Label>
                      <Input
                        type="text"
                        value={variant.colorCode || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setColorVariants((prev) =>
                            prev.map((v, i) =>
                              i === variantIndex ? { ...v, colorCode: value } : v
                            )
                          );
                        }}
                        placeholder="#FF0000 or leave blank"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 text-xs"
                        onClick={() =>
                          setColorVariants((prev) =>
                            prev.filter((_, i) => i !== variantIndex)
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Per-color image uploader (optional) */}
                  <div className="md:col-span-3 space-y-2">
                    <Label className="text-xs">Upload images for this color (optional)</Label>
                    <ImageUploader
                      onUpload={(urls) => {
                        setImages((prev) => {
                          const startIndex = prev.length;
                          const nextImages = [...prev, ...urls];

                          // Map newly uploaded images to this specific color variant
                          // Replace previous imageIndexes so the latest upload becomes primary
                          setColorVariants((prevVariants) =>
                            prevVariants.map((v, i) => {
                              if (i !== variantIndex) return v;
                              const newIndexes = urls.map((_, offset) => startIndex + offset);
                              return {
                                ...v,
                                imageIndexes: newIndexes,
                              };
                            })
                          );

                          return nextImages;
                        });
                      }}
                      cloudinaryOptions={cloudinaryOptions}
                    />
                  </div>

                  {images.length > 0 && variant.imageIndexes.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600">Selected images for this color</p>
                      <div className="grid grid-cols-4 gap-2">
                        {variant.imageIndexes
                          .map((imgIndex) => ({ imgIndex, url: images[imgIndex] }))
                          .filter((item) => typeof item.url === "string" && item.url)
                          .map(({ imgIndex, url }) => (
                            <button
                              key={imgIndex}
                              type="button"
                              onClick={() => {
                                // Allow removing an image from this color
                                setColorVariants((prev) =>
                                  prev.map((v, i) =>
                                    i === variantIndex
                                      ? {
                                          ...v,
                                          imageIndexes: v.imageIndexes.filter(
                                            (idx) => idx !== imgIndex
                                          ),
                                        }
                                      : v
                                  )
                                );
                              }}
                              className="relative aspect-square rounded-md border overflow-hidden group text-left text-xs border-purple-600 ring-2 ring-purple-200"
                            >
                              <img
                                src={url}
                                alt={`Color-${variantIndex}-img-${imgIndex}`}
                                className="object-cover w-full h-full"
                              />
                              <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-9 text-xs"
              onClick={() =>
                setColorVariants((prev) => [
                  ...prev,
                  { colorName: "", colorCode: "", imageIndexes: [] },
                ])
              }
              disabled={images.length === 0}
            >
              Add Color Variant
            </Button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-purple-700 h-11 text-base font-medium"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {submitLabel || "Saving Product..."}
              </>
            ) : (
              submitLabel || "Add Product"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
