require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Technology = require('../models/Technology');

const categoriesData = ['Frontend', 'Backend', 'Fullstack', 'Tools'];

const technologiesData = [
    { name: 'React', iconUrl: 'SiReact', category: 'Frontend' },
    { name: 'Next.js', iconUrl: 'SiNextdotjs', category: 'Frontend' },
    { name: 'Tailwind CSS', iconUrl: 'SiTailwindcss', category: 'Frontend' },
    { name: 'Typescript', iconUrl: 'SiTypescript', category: 'Frontend' },
    { name: 'Javascript', iconUrl: 'SiJavascript', category: 'Frontend' },
    { name: 'Node.js', iconUrl: 'SiNodedotjs', category: 'Backend' },
    { name: 'NestJS', iconUrl: 'SiNestjs', category: 'Backend' },
    { name: 'Express', iconUrl: 'SiExpress', category: 'Backend' },
    { name: 'HTML5', iconUrl: 'SiHtml5', category: 'Frontend' },
    { name: 'CSS3', iconUrl: 'SiCss3', category: 'Frontend' },
    { name: 'MongoDB', iconUrl: 'SiMongodb', category: 'Backend' },
    { name: 'PostgreSQL', iconUrl: 'SiPostgresql', category: 'Backend' },
    { name: 'MySQL', iconUrl: 'SiMysql', category: 'Backend' },
    { name: 'Docker', iconUrl: 'SiDocker', category: 'Tools' },
    { name: 'Git', iconUrl: 'SiGit', category: 'Tools' },
    { name: 'GitHub', iconUrl: 'SiGithub', category: 'Tools' },
    { name: 'PHP', iconUrl: 'SiPhp', category: 'Backend' },
    { name: 'Laravel', iconUrl: 'SiLaravel', category: 'Backend' },
    { name: 'Vite', iconUrl: 'SiVite', category: 'Tools' },
    { name: 'Livewire', iconUrl: 'SiLivewire', category: 'Fullstack' },
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const categoryCount = await Category.countDocuments();
        const technologyCount = await Technology.countDocuments();

        if (categoryCount === 0 && technologyCount === 0) {
            console.log('🌱 Seeding initial data...');

            // Crear categorías
            const categories = {};
            for (const name of categoriesData) {
                const category = new Category({ name });
                await category.save();
                categories[name] = category;
            }

            // Crear tecnologías
            for (const tech of technologiesData) {
                const categoryRef = categories[tech.category];
                if (categoryRef) {
                    const technology = new Technology({
                        name: tech.name,
                        iconUrl: tech.iconUrl,
                        category: categoryRef._id
                    });
                    await technology.save();
                }
            }

            console.log('✅ Seeding completado correctamente.');
        } else {
            console.log('ℹ️ La base de datos ya contiene datos, seeding omitido.');
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error en el seeding:', error);
        mongoose.disconnect();
    }
}

seedDatabase();
