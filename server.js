const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Pour Salesforce
app.use(express.json()); // Pour lire le JSON envoyé par le front
app.use(express.static('public')); // Pour servir la page web (HTML/CSS)

// --- 1. Base de données Mock (En mémoire) ---
let MOCK_DB = [
    {
        id: "RCU_001",
        email: "jean.dupont@test.com",
        firstName: "Jean",
        lastName: "Dupont",
        phone: "+33612345678",
        vipStatus: "Gold",
        balance: 150.50,
        lastOrders: [
            { id: "CMD-99", date: "2023-12-01", status: "Livré" },
            { id: "CMD-102", date: "2024-01-10", status: "En cours" }
        ]
    },
    {
        id: "RCU_002",
        email: "sophie.martin@test.com",
        firstName: "Sophie",
        lastName: "Martin",
        phone: "+33698765432",
        vipStatus: "Silver",
        balance: 0.00,
        lastOrders: []
    },
    // --- Nouveaux Clients ---
    {
        id: "RCU_003",
        email: "lucas.bernard@test.com",
        firstName: "Lucas",
        lastName: "Bernard",
        phone: "+33655443322",
        vipStatus: "Platinum",
        balance: 2500.00,
        lastOrders: [
            { id: "CMD-888", date: "2024-02-15", status: "Expédié" }
        ]
    },
    {
        id: "RCU_004",
        email: "emma.petit@test.com",
        firstName: "Emma",
        lastName: "Petit",
        phone: "+33700112233",
        vipStatus: "Bronze",
        balance: -15.00,
        lastOrders: [
            { id: "CMD-777", date: "2023-11-20", status: "Retourné" }
        ]
    }
];

// --- 2. API Endpoints ---

// A. Liste complète (Pour ton Dashboard Web)
app.get('/api/all-customers', (req, res) => {
    res.json(MOCK_DB);
});

// B. Recherche par Email (Pour Agentforce)
app.get('/api/customers', (req, res) => {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: "Email requis" });

    const customer = MOCK_DB.find(c => c.email.toLowerCase() === email.toLowerCase());

    if (customer) {
        res.json({
            found: true,
            id: customer.id,
            firstName: customer.firstName,
            email: customer.email
        });
    } else {
        res.json({ found: false });
    }
});

// C. Détail Client par ID (Pour le LWC Agent)
app.get('/api/customers/:id', (req, res) => {
    const id = req.params.id;
    const customer = MOCK_DB.find(c => c.id === id);
    if (customer) res.json(customer);
    else res.status(404).json({ error: "Client non trouvé" });
});

// D. Mise à jour Client (Pour ton Dashboard Web)
app.put('/api/customers/:id', (req, res) => {
    const id = req.params.id;
    const index = MOCK_DB.findIndex(c => c.id === id);

    if (index !== -1) {
        // On fusionne les nouvelles données avec l'existant
        MOCK_DB[index] = { ...MOCK_DB[index], ...req.body };
        console.log(`Client ${id} mis à jour :`, MOCK_DB[index]);
        res.json(MOCK_DB[index]);
    } else {
        res.status(404).json({ error: "Client non trouvé" });
    }
});

// Route par défaut : Servir l'index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`RCU Mock running on port ${PORT}`);
});
