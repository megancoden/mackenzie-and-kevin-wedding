import Link from "next/link";
import Image from "next/image";

function SectionDivider({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-4 my-10 w-full">
      <div className="flex-1 h-px bg-[var(--wedding-secondary-dark)] opacity-20" />
      <div className="flex items-center gap-2 text-[var(--wedding-secondary-dark)] opacity-60">
        <Image src={icon} alt={label} width={20} height={20} className="opacity-60" />
        <span className="casual-font text-sm tracking-widest uppercase">{label}</span>
      </div>
      <div className="flex-1 h-px bg-[var(--wedding-secondary-dark)] opacity-20" />
    </div>
  );
}

function HotelCard({
  name,
  imageSrc,
  imageAlt,
  address,
  addressLink,
  description,
  link,
  linkLabel,
  badge,
}: {
  name: string;
  imageSrc: string;
  imageAlt: string;
  address: string;
  addressLink: string;
  description: string;
  link: string;
  linkLabel: string;
  badge?: string;
}) {
  return (
    <div className="w-full max-w-lg mx-auto bg-white/60 rounded-2xl overflow-hidden shadow-sm border border-[var(--wedding-secondary-dark)]/10 mb-8">
      {badge && (
        <div className="bg-[var(--wedding-secondary-dark)] text-white text-xs tracking-widest uppercase text-center py-1.5 casual-font">
          {badge}
        </div>
      )}
      <div className="relative w-full h-52">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
        />
      </div>
      <div className="px-6 py-5 text-center">
        <h3 className="header-title leading-snug mb-1">
          {name}
        </h3>
        <p className="text-xs italic text-[var(--wedding-secondary-dark)]/60 mb-3 tracking-wide">
          <Link href={addressLink} target="_blank" rel="noopener noreferrer">
            {address}
          </Link>
        </p>
        <p className="text-sm text-[var(--wedding-secondary-dark)]/80 leading-relaxed mb-4">
          {description}
        </p>
        {link && linkLabel && (
          <Link
            href={link}
            className="inline-block text-xs casual-font tracking-wider uppercase underline underline-offset-4 hover:text-[var(--wedding-primary-dark)] transition-colors"
          >
            {linkLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

export default function TravelPage() {
  return (
    <div className="min-h-screen py-12 px-4 pt-[124px] background">
      <main className="flex flex-col items-center">
        <div className="casual-font text-[var(--wedding-secondary-dark)] bg-[#f2f5f3] rounded-2xl px-8 py-10 mt-8 w-full max-w-2xl">

          {/* ── Flying In ── */}
          <SectionDivider icon="/icons/plane.jpeg" label="Getting Here" />

          <div className="text-center space-y-3 text-sm leading-relaxed">
            <p className="text-base font-lato font-bold">Flying in?</p>
            <p>
              <span className="font-lato">DTW</span> is approximately a{" "}
              <span className="font-lato">30-minute drive</span> from West Bloomfield.
            </p>
            <p className="text-[var(--wedding-secondary-dark)]/70 italic text-xs leading-relaxed max-w-md mx-auto">
              Welcome to the Motor City! While rideshare options are available,
              the suburbs can have very long wait times and unfortunately are not
              very walkable. We recommend renting a car if you can.
            </p>
          </div>

          {/* ── Hotels ── */}
          <SectionDivider icon="/icons/hotel.jpeg" label="Where to Stay" />

          <HotelCard
            name="The Baronette Renaissance Detroit-Novi Hotel"
            imageSrc="/images/baronette.JPEG"
            imageAlt="Baronette Renaissance"
            address="27790 Novi Road, Novi, MI 48377"
            addressLink="https://www.google.com/maps/place/The+Baronette+Renaissance+Detroit-Novi+Hotel/@42.4940277,-83.4773934,17z/data=!3m1!4b1!4m10!3m9!1s0x8824af0fe092c46d:0x9193dd6b762a00f2!5m3!1s2026-04-24!4m1!1i2!8m2!3d42.4940277!4d-83.4748185!16s%2Fg%2F1tl7pb9r?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDMxNy4wIKXMDSoASAFQAw%3D%3D"
            description="We have a block of rooms at this hotel, which is approximately a 15-minute drive from wedding weekend events. Parking is free, and there is a restaurant/bar onsite. The wedding block closes September 24th."
            link="https://app.marriott.com/reslink?id=1773757010326&key=GRP&app=resvlink"
            linkLabel="Book the group rate →"
            badge="Our Room Block"
          />

          <p className="text-center text-xs uppercase tracking-widest text-[var(--wedding-secondary-dark)]/50 casual-font mb-6">
            Other nearby options
          </p>

          <HotelCard
            name="TownePlace Suites by Marriott Detroit Commerce"
            imageSrc="/images/marriott.jpg"
            imageAlt="TownePlace Suites by Marriott"
            address="199 Loop Road, Commerce Twp, MI 48390"
            addressLink="https://www.google.com/maps/place/TownePlace+Suites+by+Marriott+Detroit+Commerce/@42.5287955,-83.4457084,18z/data=!4m15!1m5!3m4!2zNDLCsDMxJzQ2LjIiTiA4M8KwMjYnMzkuOCJX!8m2!3d42.529511!4d-83.444378!3m8!1s0x8824a567f23b530d:0x68814d43019eeaf8!5m2!4m1!1i2!8m2!3d42.5294056!4d-83.4445938!16s%2Fg%2F11bw5vnszy?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDMxNy4wIKXMDSoASAFQAw%3D%3D"
            description="Offers free parking and free breakfast. Approximately a 10-minute drive to all weekend events."
            link="https://www.marriott.com/en-us/hotels/dtwtc-towneplace-suites-detroit-commerce/overview/"
            linkLabel="Book a room →"
          />

          <HotelCard
            name="Hampton Inn Commerce Novi"
            imageSrc="/images/hampton.JPEG"
            imageAlt="Hampton Inn"
            address="169 Loop Road, Commerce Twp, MI 48390"
            addressLink="https://www.google.com/maps/place/Hampton+Inn+Commerce+Novi/@42.5287133,-83.4441796,17z/data=!4m9!3m8!1s0x8824a567937ea323:0x96d357a833789dde!5m2!4m1!1i2!8m2!3d42.5287133!4d-83.4441796!16s%2Fg%2F1tmk9364?entry=ttu&g_ep=EgoyMDI2MDMxNy4wIKXMDSoASAFQAw%3D%3D"
            description="Offers free parking and free breakfast. Approximately a 10-minute drive to all weekend events."
            link="https://www.hilton.com/en/hotels/dttnihx-hampton-commerce-novi/"
            linkLabel="Book a room →"
          />
        </div>
      </main>
    </div>
  );
}