export default function SectionHeaders({subHeader,mainHeader}) {
    return(
        <>
           <h3 className="uppercase text-xl text-gray-500 semibold leading-2">
                   {subHeader}
            </h3>
            <h2 className="text-red-600 font-bold text-5xl py-2 italic">
                  {mainHeader}
            </h2>
        </>
    )
}