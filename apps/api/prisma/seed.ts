import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SETU database with Bihar tourism content and demo accounts...');

  // 1. Password Hashing
  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const vendorPasswordHash = await bcrypt.hash('vendor123', 10);
  const touristPasswordHash = await bcrypt.hash('tourist123', 10);

  // 2. Clear Existing Data
  await prisma.favorite.deleteMany();
  await prisma.order.deleteMany();
  await prisma.offering.deleteMany();
  await prisma.event.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.circuit.deleteMany();
  await prisma.district.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  // 3. Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Setu Administrator',
      email: 'admin@setu.local',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      phone: '+919876543210',
      emailVerified: true
    }
  });

  const vendorUser = await prisma.user.create({
    data: {
      name: 'Vikramaditya Heritage Tours',
      email: 'vendor@setu.local',
      passwordHash: vendorPasswordHash,
      role: 'VENDOR',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      phone: '+919123456789',
      emailVerified: true
    }
  });

  const touristUser = await prisma.user.create({
    data: {
      name: 'Ananya Sharma',
      email: 'tourist@setu.local',
      passwordHash: touristPasswordHash,
      role: 'TOURIST',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      phone: '+919988776655',
      emailVerified: true
    }
  });

  // 4. Create Demo Vendor Profile
  const demoVendor = await prisma.vendor.create({
    data: {
      userId: vendorUser.id,
      businessName: 'Setu Heritage & Cultural Experiences',
      description: 'Premier curator of authentic Bihar spiritual heritage walks, craft workshops, and private circuit tours.',
      businessType: 'Guided Tours & Experiences',
      phone: '+919123456789',
      email: 'contact@setuheritage.in',
      address: 'Main Temple Road, Bodh Gaya',
      city: 'Bodh Gaya',
      district: 'Gaya',
      latitude: 24.6961,
      longitude: 84.9914,
      logo: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      status: 'APPROVED'
    }
  });

  // 5. Create Circuits
  const buddhistCircuit = await prisma.circuit.create({
    data: {
      name: 'Buddhist Circuit',
      slug: 'buddhist-circuit',
      description: 'Trace the sacred steps of Lord Buddha from enlightenment under the Bodhi Tree in Bodh Gaya to Mahaparinirvana.',
      heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80',
      overview: 'The Buddhist Circuit in Bihar is one of the world\'s most profound pilgrimage trails. Spanning Bodh Gaya, Nalanda, Rajgir, and Vaishali, this circuit highlights ancient stupas, monastic universities, and peaceful meditation centers where Siddhartha Gautama attained Enlightenment and spent decades teaching Dhamma.',
      locations: JSON.stringify(['Bodh Gaya', 'Nalanda', 'Rajgir', 'Vaishali', 'Kesariya'])
    }
  });

  const ecoCircuit = await prisma.circuit.create({
    data: {
      name: 'Eco & Wilderness Circuit',
      slug: 'eco-circuit',
      description: 'Discover pristine tiger reserves, lush Himalayan foothills, serene lakes, and natural hot springs across Bihar.',
      heroImage: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1600&q=80',
      overview: 'Experience Bihar’s untamed biodiversity from the dense sal forests of Valmiki Tiger Reserve in Champaran to the tranquil waters of Kanwar Lake bird sanctuary and the picturesque waterfalls of Rohtas district.',
      locations: JSON.stringify(['Valmiki Nagar', 'Kanwar Lake', 'Karkat Waterfall', 'Bhimbandh Wildlife Sanctuary'])
    }
  });

  const ramayanCircuit = await prisma.circuit.create({
    data: {
      name: 'Ramayan Circuit',
      slug: 'ramayan-circuit',
      description: 'Explore ancient sites associated with Goddess Sita, Sage Valmiki, and the legendary epic of Ramayana.',
      heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
      overview: 'Journey through Janakpur borderlands, Sitamarhi (the birth place of Ma Sita), Ahilya Asthan in Darbhanga, and Buxar where Maharshi Vishwamitra guided Lord Rama.',
      locations: JSON.stringify(['Sitamarhi', 'Darbhanga', 'Buxar', 'Valmiki Nagar'])
    }
  });

  const sikhCircuit = await prisma.circuit.create({
    data: {
      name: 'Sikh Heritage Circuit',
      slug: 'sikh-circuit',
      description: 'Pay homage at Takht Sri Harmandir Sahib, the birthplace of the tenth Sikh Guru, Guru Gobind Singh Ji.',
      heroImage: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=1600&q=80',
      overview: 'The Sikh Circuit centers on Patna Sahib, one of the five Takhts of Sikhism, alongside sacred Gurdwaras visited by Guru Nanak Dev Ji and Guru Tegh Bahadur Ji across Bihar.',
      locations: JSON.stringify(['Takht Sri Patna Sahib', 'Gurdwara Guru ka Bagh', 'Gurdwara Handi Sahib', 'Rajgir Sheetal Kund'])
    }
  });

  // 6. Create Districts
  const gayaDistrict = await prisma.district.create({
    data: {
      name: 'Gaya',
      slug: 'gaya',
      region: 'South Bihar',
      description: 'Spiritual epicenter famous worldwide for Bodh Gaya and sacred Pind Daan rituals along the Phalgu River.',
      heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      latitude: 24.7914,
      longitude: 85.0002
    }
  });

  const nalandaDistrict = await prisma.district.create({
    data: {
      name: 'Nalanda',
      slug: 'nalanda',
      region: 'Central Bihar',
      description: 'Cradle of ancient higher learning housing UNESCO World Heritage Nalanda University ruins and scenic Rajgir hills.',
      heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      latitude: 25.1357,
      longitude: 85.4439
    }
  });

  const patnaDistrict = await prisma.district.create({
    data: {
      name: 'Patna',
      slug: 'patna',
      region: 'Capital Region',
      description: 'Historic Pataliputra on the banks of the sacred Ganges, blending ancient imperial history with vibrant capital life.',
      heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      latitude: 25.5941,
      longitude: 85.1376
    }
  });

  const vaishaliDistrict = await prisma.district.create({
    data: {
      name: 'Vaishali',
      slug: 'vaishali',
      region: 'North Bihar',
      description: 'World\'s oldest republic, birth place of Lord Mahavira, and site of Buddha\'s last sermon.',
      heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      latitude: 25.9923,
      longitude: 85.1264
    }
  });

  const madhubaniDistrict = await prisma.district.create({
    data: {
      name: 'Madhubani',
      slug: 'madhubani',
      region: 'Mithila Region',
      description: 'Heartland of Mithila culture renowned worldwide for exquisite Madhubani folk art and rich heritage.',
      heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      latitude: 26.3533,
      longitude: 86.0719
    }
  });

  const rohtasDistrict = await prisma.district.create({
    data: {
      name: 'Rohtas',
      slug: 'rohtas',
      region: 'South West Bihar',
      description: 'Famous for majestic Sher Shah Suri Tomb in Sasaram and breathtaking Kaimur hill waterfalls.',
      heroImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
      latitude: 24.9500,
      longitude: 84.0167
    }
  });

  const westChamparanDistrict = await prisma.district.create({
    data: {
      name: 'West Champaran',
      slug: 'west-champaran',
      region: 'North West Bihar',
      description: 'Home to Valmiki Tiger Reserve, dense forests, and Mahatma Gandhi’s historic Champaran Satyagraha.',
      heroImage: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1200&q=80',
      latitude: 27.1500,
      longitude: 84.5000
    }
  });

  const bhagalpurDistrict = await prisma.district.create({
    data: {
      name: 'Bhagalpur',
      slug: 'bhagalpur',
      region: 'East Bihar',
      description: 'The Silk City of India, home to ancient Vikramshila University and Ganges river dolphin sanctuary.',
      heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      latitude: 25.2425,
      longitude: 87.0124
    }
  });

  // 7. Create Destinations
  await prisma.destination.create({
    data: {
      name: 'Mahabodhi Temple Complex',
      slug: 'mahabodhi-temple',
      description: 'UNESCO World Heritage site marking the exact spot under the sacred Bodhi Tree where Lord Buddha attained Enlightenment.',
      districtId: gayaDistrict.id,
      circuitId: buddhistCircuit.id,
      category: 'Spiritual & World Heritage',
      heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'
      ]),
      latitude: 24.6961,
      longitude: 84.9914,
      overview: 'The Mahabodhi Temple Complex is one of the four holy sites related to the life of the Lord Buddha, and particularly to the attainment of Enlightenment. The first temple was built by Emperor Ashoka in the 3rd century B.C. The present temple dates from the 5th or 6th centuries.',
      travelInformation: JSON.stringify({
        bestTime: 'October to March',
        howToReach: 'Gaya International Airport (12 km) or Gaya Junction Railway Station (16 km)',
        suggestedDuration: '1 to 2 Days',
        entryFee: 'Free (Camera charge ₹100)'
      }),
      stays: JSON.stringify([
        { name: 'Hotel Maha Maya', rating: 4.8, price: '₹4,500/night' },
        { name: 'Root Institute Residency', rating: 4.9, price: '₹3,200/night' }
      ]),
      recommendations: JSON.stringify([
        'Attend evening chants at 6:00 PM near the Vajrasana.',
        'Visit nearby Thai Monastery and 80ft Great Buddha statue.',
        'Taste authentic Sujata Kheer from local village vendors.'
      ])
    }
  });

  await prisma.destination.create({
    data: {
      name: 'Nalanda Mahavihara Ruins',
      slug: 'nalanda-university-ruins',
      description: 'UNESCO World Heritage ruins of the ancient monastic university that enlightened scholars from across Asia from the 5th to 12th century.',
      districtId: nalandaDistrict.id,
      circuitId: buddhistCircuit.id,
      category: 'Archaeological Heritage',
      heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ]),
      latitude: 25.1357,
      longitude: 85.4439,
      overview: 'Nalanda was a renowned Mahavihara (monastic university) in the ancient kingdom of Magadha. At its peak, it accommodated over 10,000 students and 2,000 teachers including famous scholars like Hiuen Tsang and Aryabhata.',
      travelInformation: JSON.stringify({
        bestTime: 'October to March',
        howToReach: '85 km from Patna Airport; connected by Rajgir-Nalanda highway',
        suggestedDuration: '3 to 4 Hours',
        entryFee: '₹25 for Indians, ₹300 for Foreigners'
      }),
      stays: JSON.stringify([
        { name: 'Indo Hokke Hotel Rajgir', rating: 4.7, price: '₹5,800/night' }
      ]),
      recommendations: JSON.stringify([
        'Explore the Nalanda Archaeological Museum opposite the gate.',
        'Walk through Stupa No. 3 for breathtaking panoramic photos.'
      ])
    }
  });

  await prisma.destination.create({
    data: {
      name: 'Rajgir Griddhakuta & Vishwa Shanti Stupa',
      slug: 'rajgir-vishwa-shanti-stupa',
      description: 'Perched atop Ratnagiri hill in Rajgir, reached by ropeway, overlooking the ancient Vulture\'s Peak where Buddha delivered key discourses.',
      districtId: nalandaDistrict.id,
      circuitId: buddhistCircuit.id,
      category: 'Hill Station & Pilgrimage',
      heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
      ]),
      latitude: 25.0300,
      longitude: 85.4200,
      overview: 'Rajgir was the first capital of Magadha. The Vishwa Shanti Stupa (Peace Pagoda) built by Japanese Buddhist monk Fujii Guruji stands atop Gridhakuta hill. Visitors enjoy the scenic aerial ropeway, hot sulfur springs, and glass skywalk.',
      travelInformation: JSON.stringify({
        bestTime: 'September to March',
        howToReach: 'Nearest railhead: Rajgir Railway Station (5 km)',
        suggestedDuration: 'Full Day',
        entryFee: 'Ropeway ₹120 round-trip'
      }),
      stays: JSON.stringify([
        { name: 'Gargi Gautam Resort Rajgir', rating: 4.5, price: '₹4,000/night' }
      ]),
      recommendations: JSON.stringify([
        'Take the new cabin ropeway to the top of Ratnagiri Hill.',
        'Experience the glass skywalk bridge at Nature Safari Park.'
      ])
    }
  });

  await prisma.destination.create({
    data: {
      name: 'Takht Sri Patna Sahib',
      slug: 'takht-sri-patna-sahib',
      description: 'One of the five Takhts of Sikhism, built at the birthplace of the tenth Sikh Guru, Guru Gobind Singh Ji.',
      districtId: patnaDistrict.id,
      circuitId: sikhCircuit.id,
      category: 'Religious & Cultural',
      heroImage: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=1200&q=80'
      ]),
      latitude: 25.6022,
      longitude: 85.2281,
      overview: 'Constructed by Maharaja Ranjit Singh, Takht Sri Patna Sahib preserves holy relics of Guru Gobind Singh Ji, including his childhood wooden cradle, arrows, and sacred swords. Tens of thousands gather during Prakash Parv.',
      travelInformation: JSON.stringify({
        bestTime: 'Round the year (Prakash Parv in Dec/Jan)',
        howToReach: 'Patna Sahib Railway Station (2 km); Patna Airport (18 km)',
        suggestedDuration: '2 to 3 Hours',
        entryFee: 'Free (Langar open to all visitors)'
      }),
      stays: JSON.stringify([
        { name: 'Hotel Maurya Patna', rating: 4.8, price: '₹7,500/night' }
      ]),
      recommendations: JSON.stringify([
        'Participate in the 24/7 Guru ka Langar.',
        'View the sacred historic relics inside the inner sanctum museum.'
      ])
    }
  });

  await prisma.destination.create({
    data: {
      name: 'Vaishali Ashoka Pillar & Relic Stupa',
      slug: 'vaishali-ashoka-pillar',
      description: 'Site of the famous polished single-piece red sandstone Ashokan Lion Pillar and Buddha\'s last sermon.',
      districtId: vaishaliDistrict.id,
      circuitId: buddhistCircuit.id,
      category: 'Archaeological Heritage',
      heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
      ]),
      latitude: 25.9923,
      longitude: 85.1264,
      overview: 'Vaishali is revered as the birthplace of Lord Mahavira and the city where Lord Buddha delivered his final sermon. The site features the remarkably intact Ashokan Pillar topped by a single seated lion facing north.',
      travelInformation: JSON.stringify({
        bestTime: 'October to March',
        howToReach: '55 km from Patna via Mahatma Gandhi Setu bridge',
        suggestedDuration: 'Half Day',
        entryFee: '₹25 for Indians'
      }),
      stays: JSON.stringify([
        { name: 'Vaishali Residency', rating: 4.2, price: '₹2,500/night' }
      ]),
      recommendations: JSON.stringify([
        'Visit the Relic Stupa containing Buddha ashes in a casket.',
        'Explore the World Peace Pagoda near Abhishek Pushkarini tank.'
      ])
    }
  });

  await prisma.destination.create({
    data: {
      name: 'Valmiki National Park & Tiger Reserve',
      slug: 'valmiki-tiger-reserve',
      description: 'Lush biodiversity hotspot on the Indo-Nepal border featuring royal Bengal tigers, elephants, and Gandak river rafting.',
      districtId: westChamparanDistrict.id,
      circuitId: ecoCircuit.id,
      category: 'Eco & Wildlife',
      heroImage: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1200&q=80'
      ]),
      latitude: 27.1500,
      longitude: 84.5000,
      overview: 'Valmiki Tiger Reserve covers 899 sq km of dense sal forests in the Himalayan Terai arc. It is Bihar\'s primary tiger conservation sanctuary, offering jeep safaris, nature trails, and eco-resort stays.',
      travelInformation: JSON.stringify({
        bestTime: 'November to April',
        howToReach: 'Bagaha Railway Station (45 km); Patna (290 km)',
        suggestedDuration: '2 to 3 Days',
        entryFee: 'Safari ₹1,500/vehicle'
      }),
      stays: JSON.stringify([
        { name: 'Valmiki Eco Huts & Treehouses', rating: 4.7, price: '₹3,500/night' }
      ]),
      recommendations: JSON.stringify([
        'Book early morning open-top jeep safari in Manguraha range.',
        'Enjoy scenic sunset boating along the Gandak River.'
      ])
    }
  });

  await prisma.destination.create({
    data: {
      name: 'Tomb of Sher Shah Suri, Sasaram',
      slug: 'sher-shah-suri-tomb',
      description: 'Architectural masterpiece of Indo-Islamic design built in red sandstone in the middle of an artificial lake.',
      districtId: rohtasDistrict.id,
      category: 'Monuments & Architecture',
      heroImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80'
      ]),
      latitude: 24.9500,
      longitude: 84.0167,
      overview: 'Built between 1540 and 1545 by architect Aliwal Khan, this grand 122 ft high octagonal mausoleum stands serenely in a lake and is referred to as the Second Taj Mahal of India.',
      travelInformation: JSON.stringify({
        bestTime: 'October to March',
        howToReach: 'Sasaram Junction Railway Station (2 km); Grand Trunk Road',
        suggestedDuration: '2 Hours',
        entryFee: '₹25 for Indians'
      }),
      stays: JSON.stringify([
        { name: 'Hotel Grand Sasaram', rating: 4.3, price: '₹2,800/night' }
      ]),
      recommendations: JSON.stringify([
        'Capture reflection photography during golden hour.',
        'Walk across the stone causeway bridge.'
      ])
    }
  });

  await prisma.destination.create({
    data: {
      name: 'Mithila Cultural Village, Madhubani',
      slug: 'madhubani-cultural-village',
      description: 'Living heritage village showcasing legendary Madhubani / Mithila painting traditions and handloom weavers.',
      districtId: madhubaniDistrict.id,
      category: 'Art & Heritage',
      heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80'
      ]),
      latitude: 26.3533,
      longitude: 86.0719,
      overview: 'Ranti and Jitwarpur villages in Madhubani are home to National Award winning artists. Visitors can observe natural dye preparation, custom canvas creation, and purchase authentic handmade art directly from master artisans.',
      travelInformation: JSON.stringify({
        bestTime: 'October to March',
        howToReach: 'Madhubani Railway Station (4 km); Darbhanga Airport (35 km)',
        suggestedDuration: 'Full Day',
        entryFee: 'Free entry to art center workshops'
      }),
      stays: JSON.stringify([
        { name: 'Mithila Eco Homestay', rating: 4.9, price: '₹2,200/night' }
      ]),
      recommendations: JSON.stringify([
        'Take a 2-hour Madhubani painting masterclass with Padma Shri awardee family.',
        'Taste traditional Mithila Makhana kheer.'
      ])
    }
  });

  // 8. Create Events
  await prisma.event.create({
    data: {
      title: 'Chhath Puja Mahaparv',
      slug: 'chhath-puja',
      category: 'Festival',
      description: 'The premier spiritual eco-festival of Bihar dedicated to the Sun God Surya and Chhathi Maiya, celebrated with grand rituals on the ghats of the Ganges.',
      startDate: new Date('2026-11-14T00:00:00.000Z'),
      endDate: new Date('2026-11-17T23:59:59.000Z'),
      location: 'Patna Ganga Ghats, Bodh Gaya & state-wide',
      district: 'Patna',
      latitude: 25.6100,
      longitude: 85.1410,
      heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ])
    }
  });

  await prisma.event.create({
    data: {
      title: 'Pitru Paksha Mela',
      slug: 'pitru-paksha-mela',
      category: 'Religious',
      description: 'Ancient fortnight gathering along the holy Phalgu River in Gaya Ji, where millions perform sacred Pind Daan rituals for ancestral peace.',
      startDate: new Date('2026-09-25T00:00:00.000Z'),
      endDate: new Date('2026-10-10T23:59:59.000Z'),
      location: 'Vishnupad Temple Complex & Phalgu Ghats',
      district: 'Gaya',
      latitude: 24.7914,
      longitude: 85.0002,
      heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'
      ])
    }
  });

  await prisma.event.create({
    data: {
      title: 'Sonepur Cattle Fair (Sonepur Mela)',
      slug: 'sonepur-mela',
      category: 'Fair',
      description: 'Asia’s largest traditional cattle and cultural fair held at the confluence of the Ganges and Gandak rivers, featuring folk arts and handicrafts.',
      startDate: new Date('2026-11-23T00:00:00.000Z'),
      endDate: new Date('2026-12-20T23:59:59.000Z'),
      location: 'Sonepur Mela Ground, Saran/Vaishali border',
      district: 'Vaishali',
      latitude: 25.7000,
      longitude: 85.1800,
      heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
      ])
    }
  });

  await prisma.event.create({
    data: {
      title: 'Rajgir Mahotsav',
      slug: 'rajgir-mahotsav',
      category: 'Cultural',
      description: 'Annual 3-day extravaganza of classical music, dance recitals, theater performance, and culinary celebrations set against Rajgir hills.',
      startDate: new Date('2026-11-27T00:00:00.000Z'),
      endDate: new Date('2026-11-29T23:59:59.000Z'),
      location: 'Kala Gram, Rajgir',
      district: 'Nalanda',
      latitude: 25.0300,
      longitude: 85.4200,
      heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'
      ])
    }
  });

  await prisma.event.create({
    data: {
      title: '559th Prakash Parv',
      slug: 'prakash-parv',
      category: 'Religious',
      description: 'Grand anniversary celebrations commemorating Guru Gobind Singh Ji with Prabhat Pheris, Nagar Kirtan, and illumined Gurdwaras.',
      startDate: new Date('2026-12-28T00:00:00.000Z'),
      endDate: new Date('2027-01-02T23:59:59.000Z'),
      location: 'Takht Sri Harmandir Sahib, Patna',
      district: 'Patna',
      latitude: 25.6022,
      longitude: 85.2281,
      heroImage: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=1200&q=80'
      ])
    }
  });

  // 9. Create Vendor Offerings
  const offering1 = await prisma.offering.create({
    data: {
      vendorId: demoVendor.id,
      title: 'Bodh Gaya Heritage Spiritual Walk',
      slug: 'bodh-gaya-spiritual-walk',
      description: 'Immersive guided walking tour of Mahabodhi Temple complex, international monasteries (Thai, Tibetan, Japanese), and local tea ceremony with a historian.',
      category: 'Guided Tour',
      price: 1850,
      duration: '4 Hours',
      maxGuests: 8,
      location: 'Bodh Gaya, Bihar',
      latitude: 24.6961,
      longitude: 84.9914,
      coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80']),
      isActive: true
    }
  });

  const offering2 = await prisma.offering.create({
    data: {
      vendorId: demoVendor.id,
      title: 'Nalanda & Rajgir Full-Day Excursion',
      slug: 'nalanda-rajgir-full-day-excursion',
      description: 'Private AC transport, expert guide, entrance tickets to Nalanda ruins, cable car tickets to Vishwa Shanti Stupa, and authentic Bihari Litti Chokha lunch.',
      category: 'Heritage Tour',
      price: 3499,
      duration: '8 Hours',
      maxGuests: 6,
      location: 'Nalanda & Rajgir',
      latitude: 25.1357,
      longitude: 85.4439,
      coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80']),
      isActive: true
    }
  });

  const offering3 = await prisma.offering.create({
    data: {
      vendorId: demoVendor.id,
      title: 'Masterclass Madhubani Painting Experience',
      slug: 'madhubani-painting-masterclass',
      description: 'Private workshop with a Master Artisan in Ranti Village. Learn natural color extraction from turmeric and flowers, and create your own canvas to take home.',
      category: 'Cultural Experience',
      price: 2200,
      duration: '3 Hours',
      maxGuests: 4,
      location: 'Madhubani, Bihar',
      latitude: 26.3533,
      longitude: 86.0719,
      coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80']),
      isActive: true
    }
  });

  // 10. Create Demo Booking Order
  await prisma.order.create({
    data: {
      orderNumber: 'SETU-2026-8849',
      userId: touristUser.id,
      vendorId: demoVendor.id,
      offeringId: offering1.id,
      quantity: 2,
      bookingDate: new Date('2026-10-15T09:00:00.000Z'),
      amount: 3700,
      currency: 'INR',
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
      razorpayOrderId: 'order_test_9988776655',
      razorpayPaymentId: 'pay_test_1122334455',
      razorpaySignature: 'sig_valid_test_demo',
      notes: 'Please arrange an English-speaking guide.'
    }
  });

  console.log('✅ SETU Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Database Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
