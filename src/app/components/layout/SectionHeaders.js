export default function SectionHeaders({mainHeader, subHeader}) {
    return (
        <>
            <h3 className="text-4xl font-bold text-gray-800 mb-2">{mainHeader}</h3>
            {subHeader && (
                <p className="text-gray-500 text-lg mb-4 mt-2">{subHeader}</p>
            )}
        </>
    );
}