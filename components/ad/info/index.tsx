export default function ReactiveAdInfo({ad}: {ad: any}) {
    return <div className="justify-start">
      <div className="absolute hidden lg:block lg:relative xl:block xl:relative">
        Currently viewing an advertisement for {ad.title} by {ad.owner.displayName}
      </div>
      <div className="absolute hidden md:block md:relative lg:hidden lg:relative xl:hidden xl:relative ">
        {" "}
        {ad.title} by {ad.owner.displayName}
      </div>
      <div className="relative block md:hidden md:absolute lg:hidden lg:absolute xl:hidden xl:absolute">
        {ad.title}
      </div>
    </div>;
  }
  