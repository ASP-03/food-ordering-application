import SectionHeaders from "../../components/layout/SectionHeaders";
import MenuItem from "../../components/menu/MenuItem"
import Image from "next/image";


export default function HomeMenu(){
    return(
        <section>
              <div className="absolute left-0 right-0 w-full justify-start">
                 <div className="h-48 w-48 absolute -left-12">
                    <Image src={'/salad1.jpg'} width={156} height={304} alt={'salad'} />
                 </div>
                 <div className="h-48 absolute -top-24 right-0 -z-10">
                    <Image src={'/salad2.jpg'} width={156} height={305} alt={'salad'} />
                 </div>
              </div>
             <div className="text-center mb-4 mt-4">
                <SectionHeaders 
                   subHeader={'CHECK OUT OUR'}
                   mainHeader={'MENU'} />
             </div>
             <div className="grid grid-cols-3 gap-4">
                <MenuItem />
                <MenuItem />
                <MenuItem />
                <MenuItem />
                <MenuItem />
                <MenuItem />
             </div>
        </section>
    )
}