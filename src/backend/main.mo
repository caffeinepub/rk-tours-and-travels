import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";

actor {
  type Region = {
    #north;
    #south;
    #east;
    #west;
    #central;
  };

  type TourPackage = {
    id : Nat;
    name : Text;
    destination : Text;
    region : Region;
    duration : Text;
    price : Nat;
    highlights : [Text];
    category : Text;
  };

  module TourPackage {
    public func compare(p1 : TourPackage, p2 : TourPackage) : Order.Order {
      switch (Text.compare(p1.destination, p2.destination)) {
        case (#equal) { Text.compare(p1.name, p2.name) };
        case (order) { order };
      };
    };
  };

  type Inquiry = {
    name : Text;
    email : Text;
    phone : Text;
    destination : Text;
    travelDates : Text;
    travelers : Nat;
    message : Text;
  };

  let tourPackages = Map.empty<Nat, TourPackage>();
  let inquiries = Map.empty<Principal, Inquiry>();

  let samplePackages : [TourPackage] = [
    {
      id = 1;
      name = "Goa Beach Getaway";
      destination = "Goa";
      region = #west;
      duration = "5 Days / 4 Nights";
      price = 15000;
      highlights = ["Beaches", "Water Sports", "Nightlife"];
      category = "Beach";
    },
    {
      id = 2;
      name = "Kerala Backwaters";
      destination = "Kerala";
      region = #south;
      duration = "6 Days / 5 Nights";
      price = 18000;
      highlights = ["Houseboats", "Ayurveda", "Wildlife Sanctuaries"];
      category = "Hill Station";
    },
    {
      id = 3;
      name = "Rajasthan Heritage Tour";
      destination = "Rajasthan";
      region = #north;
      duration = "7 Days / 6 Nights";
      price = 22000;
      highlights = ["Forts & Palaces", "Desert Safari", "Cultural Shows"];
      category = "Heritage";
    },
    {
      id = 4;
      name = "Himachal Adventure";
      destination = "Himachal Pradesh";
      region = #north;
      duration = "5 Days / 4 Nights";
      price = 14000;
      highlights = ["Trekking", "Paragliding", "River Rafting"];
      category = "Adventure";
    },
    {
      id = 5;
      name = "Ladakh Escapade";
      destination = "Ladakh";
      region = #north;
      duration = "8 Days / 7 Nights";
      price = 35000;
      highlights = ["Mountain Passes", "Monasteries", "Scenic Views"];
      category = "Adventure";
    },
    {
      id = 6;
      name = "Andaman Island Retreat";
      destination = "Andaman";
      region = #east;
      duration = "6 Days / 5 Nights";
      price = 24000;
      highlights = ["Beaches", "Snorkeling", "Island Hopping"];
      category = "Beach";
    },
    {
      id = 7;
      name = "Varanasi Spiritual Journey";
      destination = "Varanasi";
      region = #central;
      duration = "4 Days / 3 Nights";
      price = 12000;
      highlights = ["Ganga Aarti", "Temples", "Cultural Tours"];
      category = "Heritage";
    },
    {
      id = 8;
      name = "Jim Corbett Wildlife Safari";
      destination = "Jim Corbett National Park";
      region = #north;
      duration = "3 Days / 2 Nights";
      price = 10000;
      highlights = ["Jungle Safari", "Bird Watching", "Nature Trails"];
      category = "Wildlife";
    },
  ];

  public shared ({ caller }) func seedTourPackages() : async () {
    var i = 0;
    while (i < samplePackages.size()) {
      let pkg = samplePackages[i];
      tourPackages.add(pkg.id, pkg);
      i += 1;
    };
  };

  public query ({ caller }) func getAllTourPackages() : async [TourPackage] {
    tourPackages.values().toArray();
  };

  public query ({ caller }) func getTourPackageById(id : Nat) : async TourPackage {
    switch (tourPackages.get(id)) {
      case (null) { Runtime.trap("Tour package not found") };
      case (?pkg) { pkg };
    };
  };

  public query ({ caller }) func getPackagesByRegion(region : Region) : async [TourPackage] {
    let filteredIter = tourPackages.values().filter(
      func(pkg) {
        pkg.region == region;
      }
    );
    filteredIter.toArray();
  };

  public shared ({ caller }) func submitInquiry(inquiry : Inquiry) : async () {
    inquiries.add(caller, inquiry);
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    inquiries.values().toArray();
  };
};
