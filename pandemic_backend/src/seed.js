const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Country = require('./models/Country');
const City = require('./models/City');
const Area = require('./models/Area');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pandemic_tracker');
    console.log('Connected');

    await User.deleteMany({});
    await Country.deleteMany({});
    await City.deleteMany({});
    await Area.deleteMany({});

    // Users
    await User.create({
      name: 'Admin',
      email: 'admin@pandemic.com',
      password: 'admin123',
      role: 'admin'
    });
    await User.create({
      name: 'Health Worker',
      email: 'worker@pandemic.com',
      password: 'worker123',
      role: 'health_worker'
    });
    await User.create({
      name: 'Public Viewer',
      email: 'viewer@pandemic.com',
      password: 'viewer123',
      role: 'viewer'
    });

    // Pakistan
    const pk = await Country.create({
      name: 'Pakistan',
      code: 'PK',
      center: { type: 'Point', coordinates: [69.3451, 30.3753] },
      totalCases: 0, totalRecovered: 0, totalDeaths: 0, activeCases: 0
    });

    // India
    const in_ = await Country.create({
      name: 'India',
      code: 'IN',
      center: { type: 'Point', coordinates: [78.9629, 20.5937] },
      totalCases: 0, totalRecovered: 0, totalDeaths: 0, activeCases: 0
    });

    // Cities - Pakistan
    const lahore = await City.create({
      name: 'Lahore',
      country: pk._id,
      center: { type: 'Point', coordinates: [74.3587, 31.5204] }
    });
    const karachi = await City.create({
      name: 'Karachi',
      country: pk._id,
      center: { type: 'Point', coordinates: [67.0011, 24.8607] }
    });
    const islamabad = await City.create({
      name: 'Islamabad',
      country: pk._id,
      center: { type: 'Point', coordinates: [73.0479, 33.6844] }
    });

    // Cities - India
    const delhi = await City.create({
      name: 'New Delhi',
      country: in_._id,
      center: { type: 'Point', coordinates: [77.2090, 28.6139] }
    });
    const mumbai = await City.create({
      name: 'Mumbai',
      country: in_._id,
      center: { type: 'Point', coordinates: [72.8777, 19.0760] }
    });

    // Areas with sample data
    const areasData = [
      // Lahore
      { name: 'Gulberg', city: lahore, country: pk, coords: [74.3436, 31.5102], cases: 420, recovered: 380, deaths: 12, active: 28, pop: 85000, risk: 'moderate' },
      { name: 'Model Town', city: lahore, country: pk, coords: [74.3215, 31.4825], cases: 210, recovered: 195, deaths: 5, active: 10, pop: 62000, risk: 'low' },
      { name: 'Johar Town', city: lahore, country: pk, coords: [74.2700, 31.4697], cases: 890, recovered: 720, deaths: 35, active: 135, pop: 120000, risk: 'high' },
      { name: 'DHA', city: lahore, country: pk, coords: [74.3847, 31.4697], cases: 150, recovered: 140, deaths: 3, active: 7, pop: 95000, risk: 'low' },
      // Karachi
      { name: 'Clifton', city: karachi, country: pk, coords: [67.0300, 24.8138], cases: 560, recovered: 490, deaths: 22, active: 48, pop: 110000, risk: 'moderate' },
      { name: 'Gulshan-e-Iqbal', city: karachi, country: pk, coords: [67.0922, 24.9207], cases: 1200, recovered: 980, deaths: 55, active: 165, pop: 180000, risk: 'high' },
      { name: 'North Nazimabad', city: karachi, country: pk, coords: [67.0385, 24.9380], cases: 340, recovered: 310, deaths: 8, active: 22, pop: 95000, risk: 'low' },
      // Islamabad
      { name: 'F-7', city: islamabad, country: pk, coords: [73.0500, 33.7200], cases: 95, recovered: 88, deaths: 2, active: 5, pop: 45000, risk: 'low' },
      { name: 'G-9', city: islamabad, country: pk, coords: [73.0400, 33.6900], cases: 180, recovered: 150, deaths: 6, active: 24, pop: 55000, risk: 'moderate' },
      // Delhi
      { name: 'Connaught Place', city: delhi, country: in_, coords: [77.2167, 28.6315], cases: 780, recovered: 650, deaths: 30, active: 100, pop: 90000, risk: 'high' },
      { name: 'South Delhi', city: delhi, country: in_, coords: [77.2200, 28.5200], cases: 450, recovered: 400, deaths: 15, active: 35, pop: 150000, risk: 'moderate' },
      // Mumbai
      { name: 'Andheri', city: mumbai, country: in_, coords: [72.8467, 19.1197], cases: 1100, recovered: 920, deaths: 48, active: 132, pop: 200000, risk: 'high' },
      { name: 'Bandra', city: mumbai, country: in_, coords: [72.8400, 19.0600], cases: 320, recovered: 290, deaths: 10, active: 20, pop: 80000, risk: 'low' }
    ];

    for (const a of areasData) {
      await Area.create({
        name: a.name,
        city: a.city._id,
        country: a.country._id,
        center: { type: 'Point', coordinates: a.coords },
        totalCases: a.cases,
        totalRecovered: a.recovered,
        totalDeaths: a.deaths,
        activeCases: a.active,
        population: a.pop,
        riskLevel: a.risk
      });

      // Aggregate to city
      a.city.totalCases += a.cases;
      a.city.totalRecovered += a.recovered;
      a.city.totalDeaths += a.deaths;
      a.city.activeCases += a.active;
      await a.city.save();

      // Aggregate to country
      a.country.totalCases += a.cases;
      a.country.totalRecovered += a.recovered;
      a.country.totalDeaths += a.deaths;
      a.country.activeCases += a.active;
      await a.country.save();
    }

    console.log('Seed completed!');
    console.log('\n=== Login Credentials ===');
    console.log('Admin:   admin@pandemic.com / admin123');
    console.log('Worker:  worker@pandemic.com / worker123');
    console.log('Viewer:  viewer@pandemic.com / viewer123');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

seed();
