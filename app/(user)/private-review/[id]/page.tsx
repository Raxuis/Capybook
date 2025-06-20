import React from 'react';
import { getReview } from "@/actions/reviews";
import ReviewCard from "@/components/Reviews/ReviewCard";
import { Button } from "@/components/ui/button";
import { Link as NextLink } from "next-view-transitions";
import { ArrowLeft, AlertTriangle } from "lucide-react";

interface PrivateReviewPageProps {
  params: {
    id: string;
  };
}

export default async function PrivateReviewPage({ params }: PrivateReviewPageProps) {
  const review = await getReview(params.id);

  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Critique introuvable</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          Nous n&apos;avons pas pu trouver cette critique. Elle a peut-être été supprimée, ou vous n&apos;avez pas la permission de la voir.
        </p>
        <Button asChild>
          <NextLink href="/reviews">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux critiques
          </NextLink>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <NextLink href="/reviews">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux critiques
          </NextLink>
        </Button>
      </div>
      <div className="p-4 sm:p-6 md:p-8 bg-card rounded-xl border">
        <ReviewCard review={review} />
      </div>
    </div>
  );
}
