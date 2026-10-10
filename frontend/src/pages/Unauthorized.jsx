const Unauthorized = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600">
                    403
                </h1>

                <h2 className="mt-4 text-2xl font-semibold">
                    Accès refusé
                </h2>

                <p className="mt-2 text-slate-500">
                    Vous n'avez pas les permissions nécessaires
                    pour accéder à cette page.
                </p>
            </div>
        </div>
    );
};

export default Unauthorized;