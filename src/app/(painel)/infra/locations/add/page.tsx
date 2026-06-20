import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";

import { LocationForm } from "@/components/locations/location-form";

export default function Page() {
    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
            <PageTitle
                title="Adicionar Local"
                leftSide={<BackButton fallbackUrl="/infra/locations" />}
            />

            <LocationForm />
        </div>
    );
}
