from datetime import date
from app import db
from app.models import Company, Product, Relationship


def seed_semiconductor_industry():
    """Seed the database with semiconductor industry data"""

    # Clear existing data
    Relationship.query.delete()
    Product.query.delete()
    Company.query.delete()
    db.session.commit()

    # Companies data - Major semiconductor industry players
    companies_data = [
        # EDA Tools
        {
            'name': 'Cadence Design Systems',
            'sector': 'EDA Tools',
            'sub_sector': 'Electronic Design Automation',
            'headquarters': 'San Jose, California, USA',
            'founded_year': 1988,
            'revenue': 3.5,
            'employees': 9800,
            'market_cap': 75.0,
            'description': 'Leading EDA software company providing tools for semiconductor design, verification, and IP',
            'supply_chain_stage': 'EDA Tools',
            'products': [
                {'name': 'Virtuoso Platform', 'category': 'Design Software', 'sub_category': 'Schematic Entry', 'description': 'Analog and mixed-signal design environment'},
                {'name': 'Genus Synthesis', 'category': 'Design Software', 'sub_category': 'Logic Synthesis', 'description': 'Digital design synthesis solution'},
                {'name': 'Innovus Implementation', 'category': 'Design Software', 'sub_category': 'Place & Route', 'description': 'Digital implementation platform'},
                {'name': 'Tempus Timing', 'category': 'Design Software', 'sub_category': 'Timing Analysis', 'description': 'Signoff timing analysis solution'},
            ]
        },
        {
            'name': 'Synopsys',
            'sector': 'EDA Tools',
            'sub_sector': 'Electronic Design Automation',
            'headquarters': 'Mountain View, California, USA',
            'founded_year': 1986,
            'revenue': 5.8,
            'employees': 20000,
            'market_cap': 85.0,
            'description': 'World leader in EDA, providing semiconductor design and verification solutions',
            'supply_chain_stage': 'EDA Tools',
            'products': [
                {'name': 'Design Compiler', 'category': 'Design Software', 'sub_category': 'Logic Synthesis', 'description': 'RTL synthesis solution'},
                {'name': 'IC Compiler II', 'category': 'Design Software', 'sub_category': 'Place & Route', 'description': 'Advanced node physical implementation'},
                {'name': 'PrimeTime', 'category': 'Design Software', 'sub_category': 'Timing Analysis', 'description': 'Signoff timing analysis'},
                {'name': 'HAPS', 'category': 'Verification', 'sub_category': 'Emulation', 'description': 'Prototyping and emulation systems'},
            ]
        },
        {
            'name': 'Siemens EDA',
            'sector': 'EDA Tools',
            'sub_sector': 'Electronic Design Automation',
            'headquarters': 'Wilsonville, Oregon, USA',
            'founded_year': 1981,
            'revenue': 2.8,
            'employees': 7000,
            'market_cap': 45.0,
            'description': 'Part of Siemens Digital Industries Software, providing EDA solutions',
            'supply_chain_stage': 'EDA Tools',
            'products': [
                {'name': 'Mentor Questa', 'category': 'Verification', 'sub_category': 'Simulation', 'description': 'Verification and simulation platform'},
                {'name': 'Calibre', 'category': 'Design Software', 'sub_category': 'DRC/LVS', 'description': 'Physical verification tools'},
                {'name': 'Tessent', 'category': 'Design Software', 'sub_category': 'DFT', 'description': 'Design for test solutions'},
            ]
        },

        # Design - Fabless
        {
            'name': 'NVIDIA',
            'sector': 'Semiconductors',
            'sub_sector': 'Fabless Design',
            'headquarters': 'Santa Clara, California, USA',
            'founded_year': 1993,
            'revenue': 60.9,
            'employees': 29600,
            'market_cap': 2800.0,
            'description': 'Leading GPU manufacturer and AI computing company',
            'supply_chain_stage': 'Design',
            'products': [
                {'name': 'H100 GPU', 'category': 'GPU', 'sub_category': 'Data Center', 'description': 'Hopper architecture data center GPU', 'technology_node': '4nm'},
                {'name': 'A100 GPU', 'category': 'GPU', 'sub_category': 'Data Center', 'description': 'Ampere architecture data center GPU', 'technology_node': '7nm'},
                {'name': 'RTX 4090', 'category': 'GPU', 'sub_category': 'Consumer', 'description': 'Ada Lovelace gaming GPU', 'technology_node': '4nm'},
                {'name': 'Jetson Orin', 'category': 'SoC', 'sub_category': 'Edge/AI', 'description': 'Edge AI computing platform', 'technology_node': '8nm'},
            ]
        },
        {
            'name': 'AMD',
            'sector': 'Semiconductors',
            'sub_sector': 'Fabless Design',
            'headquarters': 'Santa Clara, California, USA',
            'founded_year': 1969,
            'revenue': 22.7,
            'employees': 25800,
            'market_cap': 280.0,
            'description': 'Fabless semiconductor company specializing in CPUs, GPUs, and adaptive computing',
            'supply_chain_stage': 'Design',
            'products': [
                {'name': 'Ryzen 9000', 'category': 'CPU', 'sub_category': 'Desktop', 'description': 'Zen 5 architecture desktop processor', 'technology_node': '4nm'},
                {'name': 'EPYC Genoa', 'category': 'CPU', 'sub_category': 'Server', 'description': 'Zen 4 server processor', 'technology_node': '5nm'},
                {'name': 'Radeon RX 7900', 'category': 'GPU', 'sub_category': 'Consumer', 'description': 'RDNA 3 gaming GPU', 'technology_node': '5nm'},
                {'name': 'Instinct MI300X', 'category': 'GPU', 'sub_category': 'Data Center', 'description': 'AI and HPC accelerator', 'technology_node': '5nm'},
            ]
        },
        {
            'name': 'Qualcomm',
            'sector': 'Semiconductors',
            'sub_sector': 'Fabless Design',
            'headquarters': 'San Diego, California, USA',
            'founded_year': 1985,
            'revenue': 35.8,
            'employees': 51000,
            'market_cap': 180.0,
            'description': 'Leading wireless technology company and smartphone chipset manufacturer',
            'supply_chain_stage': 'Design',
            'products': [
                {'name': 'Snapdragon 8 Gen 3', 'category': 'SoC', 'sub_category': 'Mobile', 'description': 'Flagship mobile processor', 'technology_node': '4nm'},
                {'name': 'Snapdragon X Elite', 'category': 'SoC', 'sub_category': 'PC', 'description': 'PC processor with NPU', 'technology_node': '4nm'},
                {'name': 'QCM6490', 'category': 'SoC', 'sub_category': 'IoT/Edge', 'description': 'Industrial IoT connectivity platform', 'technology_node': '6nm'},
            ]
        },
        {
            'name': 'Broadcom',
            'sector': 'Semiconductors',
            'sub_sector': 'Fabless Design',
            'headquarters': 'San Jose, California, USA',
            'founded_year': 1991,
            'revenue': 35.8,
            'employees': 20000,
            'market_cap': 650.0,
            'description': 'Semiconductor infrastructure software provider focusing on enterprise and data center',
            'supply_chain_stage': 'Design',
            'products': [
                {'name': 'Tomahawk 5', 'category': 'Network ASIC', 'sub_category': 'Switching', 'description': '51.2Tbps switching silicon', 'technology_node': '5nm'},
                {'name': 'Trident 4', 'category': 'Network ASIC', 'sub_category': 'Switching', 'description': '12.8Tbps switching for enterprise', 'technology_node': '7nm'},
                {'name': 'BCM4389', 'category': 'Wireless', 'sub_category': 'WiFi', 'description': 'Wi-Fi 7 combo chip', 'technology_node': '14nm'},
            ]
        },
        {
            'name': 'Marvell Technology',
            'sector': 'Semiconductors',
            'sub_sector': 'Fabless Design',
            'headquarters': 'Wilmington, Delaware, USA',
            'founded_year': 1995,
            'revenue': 5.5,
            'employees': 6500,
            'market_cap': 80.0,
            'description': 'Data infrastructure semiconductor solutions provider',
            'supply_chain_stage': 'Design',
            'products': [
                {'name': 'OCTEON 10', 'category': 'Network Processor', 'sub_category': 'Infrastructure', 'description': 'Native 5G data processing', 'technology_node': '5nm'},
                {'name': 'Brightlane', 'category': 'Automotive Ethernet', 'sub_category': 'Automotive', 'description': 'Automotive Ethernet portfolio', 'technology_node': '14nm'},
            ]
        },

        # Manufacturing - Foundries
        {
            'name': 'TSMC',
            'sector': 'Semiconductors',
            'sub_sector': 'Foundry',
            'headquarters': 'Hsinchu, Taiwan',
            'founded_year': 1987,
            'revenue': 69.3,
            'employees': 73000,
            'market_cap': 550.0,
            'description': 'World leading pure-play foundry manufacturing semiconductors for fabless companies',
            'supply_chain_stage': 'Manufacturing',
            'products': [
                {'name': 'N3E Process', 'category': 'Wafer Fabrication', 'sub_category': 'Advanced Node', 'description': '3nm enhanced process node', 'technology_node': '3nm'},
                {'name': 'N5 Process', 'category': 'Wafer Fabrication', 'sub_category': 'Advanced Node', 'description': '5nm process node', 'technology_node': '5nm'},
                {'name': 'N7 Process', 'category': 'Wafer Fabrication', 'sub_category': 'Standard Node', 'description': '7nm process node', 'technology_node': '7nm'},
            ]
        },
        {
            'name': 'Samsung Electronics',
            'sector': 'Semiconductors',
            'sub_sector': 'Foundry/IDM',
            'headquarters': 'Suwon, South Korea',
            'founded_year': 1969,
            'revenue': 55.0,
            'employees': 120000,
            'market_cap': 350.0,
            'description': 'Integrated device manufacturer and foundry offering semiconductor manufacturing services',
            'supply_chain_stage': 'Manufacturing',
            'products': [
                {'name': '3GAE Process', 'category': 'Wafer Fabrication', 'sub_category': 'Advanced Node', 'description': '3nm Gate-All-Around Early', 'technology_node': '3nm'},
                {'name': '4LPP Process', 'category': 'Wafer Fabrication', 'sub_category': 'Advanced Node', 'description': '4nm Low Power Plus', 'technology_node': '4nm'},
                {'name': '5LPE Process', 'category': 'Wafer Fabrication', 'sub_category': 'Advanced Node', 'description': '5nm Low Power Early', 'technology_node': '5nm'},
            ]
        },
        {
            'name': 'Intel Foundry Services',
            'sector': 'Semiconductors',
            'sub_sector': 'Foundry',
            'headquarters': 'Santa Clara, California, USA',
            'founded_year': 2021,
            'revenue': 8.0,
            'employees': 5000,
            'market_cap': 180.0,
            'description': 'Intel\'s foundry services business targeting advanced manufacturing',
            'supply_chain_stage': 'Manufacturing',
            'products': [
                {'name': 'Intel 20A', 'category': 'Wafer Fabrication', 'sub_category': 'Advanced Node', 'description': '20 Angstrom with RibbonFET', 'technology_node': '20A'},
                {'name': 'Intel 18A', 'category': 'Wafer Fabrication', 'sub_category': 'Advanced Node', 'description': '18 Angstrom process', 'technology_node': '18A'},
                {'name': 'Intel 3', 'category': 'Wafer Fabrication', 'sub_category': 'Standard Node', 'description': '3nm class process', 'technology_node': '3nm'},
            ]
        },
        {
            'name': 'GlobalFoundries',
            'sector': 'Semiconductors',
            'sub_sector': 'Foundry',
            'headquarters': 'Malta, New York, USA',
            'founded_year': 2009,
            'revenue': 7.1,
            'employees': 15000,
            'market_cap': 25.0,
            'description': 'Pure-play foundry providing global manufacturing services',
            'supply_chain_stage': 'Manufacturing',
            'products': [
                {'name': '12LP+', 'category': 'Wafer Fabrication', 'sub_category': 'Standard Node', 'description': '14/12nm automotive qualified', 'technology_node': '14nm'},
                {'name': '22FDX', 'category': 'Wafer Fabrication', 'sub_category': 'FD-SOI', 'description': '22nm FDX for IoT and automotive', 'technology_node': '22nm'},
                {'name': '28HV', 'category': 'Wafer Fabrication', 'sub_category': 'Specialty', 'description': '28nm high voltage for OLED', 'technology_node': '28nm'},
            ]
        },

        # Equipment
        {
            'name': 'ASML',
            'sector': 'Semiconductor Equipment',
            'sub_sector': 'Lithography',
            'headquarters': 'Veldhoven, Netherlands',
            'founded_year': 1984,
            'revenue': 27.6,
            'employees': 42000,
            'market_cap': 400.0,
            'description': 'Leading supplier of lithography systems for semiconductor manufacturing',
            'supply_chain_stage': 'Equipment',
            'products': [
                {'name': 'High-NA EUV TWINSCAN EXE', 'category': 'Lithography', 'sub_category': 'EUV', 'description': 'High-NA EUV lithography system', 'technology_node': '2nm'},
                {'name': 'TWINSCAN NXE', 'category': 'Lithography', 'sub_category': 'EUV', 'description': 'EUV lithography system', 'technology_node': '3nm+'},
                {'name': 'TWINSCAN NXT', 'category': 'Lithography', 'sub_category': 'DUV', 'description': 'ArFi immersion lithography', 'technology_node': '7nm+'},
            ]
        },
        {
            'name': 'Applied Materials',
            'sector': 'Semiconductor Equipment',
            'sub_sector': 'Process Equipment',
            'headquarters': 'Santa Clara, California, USA',
            'founded_year': 1967,
            'revenue': 27.2,
            'employees': 35000,
            'market_cap': 180.0,
            'description': 'Leading supplier of process equipment for semiconductor manufacturing',
            'supply_chain_stage': 'Equipment',
            'products': [
                {'name': 'Centura Etch', 'category': 'Process Equipment', 'sub_category': 'Etch', 'description': 'Atomic layer etch systems'},
                {'name': 'Endura PVD', 'category': 'Process Equipment', 'sub_category': 'Deposition', 'description': 'Physical vapor deposition'},
                {'name': 'Producer CVD', 'category': 'Process Equipment', 'sub_category': 'Deposition', 'description': 'Chemical vapor deposition'},
            ]
        },
        {
            'name': 'Lam Research',
            'sector': 'Semiconductor Equipment',
            'sub_sector': 'Process Equipment',
            'headquarters': 'Fremont, California, USA',
            'founded_year': 1980,
            'revenue': 17.4,
            'employees': 18000,
            'market_cap': 120.0,
            'description': 'Supplier of semiconductor process equipment for etch and deposition',
            'supply_chain_stage': 'Equipment',
            'products': [
                {'name': 'Kiyo Series', 'category': 'Process Equipment', 'sub_category': 'Etch', 'description': 'Conductor etch systems'},
                {'name': 'Senseki Series', 'category': 'Process Equipment', 'sub_category': 'Etch', 'description': 'High-k metal gate etch'},
                {'name': 'Striker Series', 'category': 'Process Equipment', 'sub_category': 'Deposition', 'description': 'ALE deposition systems'},
            ]
        },
        {
            'name': 'KLA Corporation',
            'sector': 'Semiconductor Equipment',
            'sub_sector': 'Process Control',
            'headquarters': 'Milpitas, California, USA',
            'founded_year': 1975,
            'revenue': 9.2,
            'employees': 14000,
            'market_cap': 85.0,
            'description': 'Leading supplier of process control and yield management solutions',
            'supply_chain_stage': 'Equipment',
            'products': [
                {'name': 'PWM系统', 'category': 'Inspection', 'sub_category': 'Pattern Inspection', 'description': 'Plasma discharge monitoring'},
                {'name': 'Broadview', 'category': 'Inspection', 'sub_category': 'Wafer Inspection', 'description': 'Surface inspection systems'},
                {'name': 'Surfscan', 'category': 'Inspection', 'sub_category': 'Unpatterned Wafer', 'description': 'Unpatterned wafer inspection'},
            ]
        },
        {
            'name': 'Tokyo Electron',
            'sector': 'Semiconductor Equipment',
            'sub_sector': 'Process Equipment',
            'headquarters': 'Tokyo, Japan',
            'founded_year': 1963,
            'revenue': 16.5,
            'employees': 20000,
            'market_cap': 75.0,
            'description': 'Japanese supplier of semiconductor and FPD production equipment',
            'supply_chain_stage': 'Equipment',
            'products': [
                {'name': 'Cell Controller', 'category': 'Process Equipment', 'sub_category': 'Coater/Developer', 'description': 'Track lithography systems'},
                {'name': 'Etch System', 'category': 'Process Equipment', 'sub_category': 'Etch', 'description': 'Dry etch systems'},
                {'name': 'CVD System', 'category': 'Process Equipment', 'sub_category': 'Deposition', 'description': 'Chemical vapor deposition'},
            ]
        },

        # Materials
        {
            'name': 'Shin-Etsu Chemical',
            'sector': 'Semiconductor Materials',
            'sub_sector': 'Silicon Materials',
            'headquarters': 'Tokyo, Japan',
            'founded_year': 1921,
            'revenue': 7.5,
            'employees': 12000,
            'market_cap': 25.0,
            'description': 'Leading supplier of silicon wafers and specialty chemicals',
            'supply_chain_stage': 'Materials',
            'products': [
                {'name': 'Silicon Wafers', 'category': 'Silicon Materials', 'sub_category': 'Wafer', 'description': '12-inch, 8-inch, 6-inch silicon wafers'},
                {'name': 'Epi Wafers', 'category': 'Silicon Materials', 'sub_category': 'Epitaxial', 'description': 'Epitaxial silicon wafers'},
                {'name': 'Photoresist', 'category': 'Chemicals', 'sub_category': 'Resist', 'description': 'Photoresist materials'},
            ]
        },
        {
            'name': 'Air Products',
            'sector': 'Semiconductor Materials',
            'sub_sector': 'Industrial Gases',
            'headquarters': 'Allentown, Pennsylvania, USA',
            'founded_year': 1940,
            'revenue': 12.6,
            'employees': 17000,
            'market_cap': 55.0,
            'description': 'Supplier of industrial gases and specialty gases for semiconductor manufacturing',
            'supply_chain_stage': 'Materials',
            'products': [
                {'name': 'Nitrogen', 'category': 'Industrial Gas', 'sub_category': 'Bulk Gas', 'description': 'Ultra-high purity nitrogen'},
                {'name': 'Specialty Gases', 'category': 'Industrial Gas', 'sub_category': 'Process Gas', 'description': 'Etchant and dopant gases'},
                {'name': 'CMP Slurry', 'category': 'Chemicals', 'sub_category': 'CMP', 'description': 'Chemical mechanical planarization slurry'},
            ]
        },
        {
            'name': 'Linde',
            'sector': 'Semiconductor Materials',
            'sub_sector': 'Industrial Gases',
            'headquarters': 'Dublin, Ireland',
            'founded_year': 1879,
            'revenue': 32.9,
            'employees': 65000,
            'market_cap': 200.0,
            'description': 'Global industrial gases company serving semiconductor industry',
            'supply_chain_stage': 'Materials',
            'products': [
                {'name': 'Electronic Gases', 'category': 'Industrial Gas', 'sub_category': 'Specialty Gas', 'description': 'High-purity specialty gases'},
                {'name': 'Argon', 'category': 'Industrial Gas', 'sub_category': 'Bulk Gas', 'description': 'Ultra-high purity argon'},
                {'name': 'Hydrogen', 'category': 'Industrial Gas', 'sub_category': 'Bulk Gas', 'description': 'High-purity hydrogen for deposition'},
            ]
        },
        {
            'name': 'JSR Corporation',
            'sector': 'Semiconductor Materials',
            'sub_sector': 'Photoresist',
            'headquarters': 'Tokyo, Japan',
            'founded_year': 1957,
            'revenue': 3.2,
            'employees': 5000,
            'market_cap': 5.0,
            'description': 'Japanese materials company specializing in photoresists and coatings',
            'supply_chain_stage': 'Materials',
            'products': [
                {'name': 'EUV Photoresist', 'category': 'Photoresist', 'sub_category': 'EUV', 'description': 'Extreme ultraviolet photoresist'},
                {'name': 'ArF Photoresist', 'category': 'Photoresist', 'sub_category': 'ArF', 'description': 'ArF immersion photoresist'},
                {'name': 'Topcoat', 'category': 'Coating', 'sub_category': 'Protective', 'description': 'Protective topcoat materials'},
            ]
        },

        # Packaging/Testing
        {
            'name': 'ASE Technology',
            'sector': 'Semiconductor Manufacturing',
            'sub_sector': 'OSAT',
            'headquarters': 'Kaohsiung, Taiwan',
            'founded_year': 1984,
            'revenue': 18.0,
            'employees': 100000,
            'market_cap': 22.0,
            'description': 'Leading outsourced semiconductor assembly and test company',
            'supply_chain_stage': 'Packaging/Testing',
            'products': [
                {'name': 'FCBGA', 'category': 'Packaging', 'sub_category': 'Advanced Packaging', 'description': 'Flip chip ball grid array'},
                {'name': 'FCCSP', 'category': 'Packaging', 'sub_category': 'Advanced Packaging', 'description': 'Flip chip chip scale package'},
                {'name': 'Test Services', 'category': 'Testing', 'sub_category': 'ATE', 'description': 'Automatic test equipment services'},
            ]
        },
        {
            'name': 'Amkor Technology',
            'sector': 'Semiconductor Manufacturing',
            'sub_sector': 'OSAT',
            'headquarters': 'Chandler, Arizona, USA',
            'founded_year': 1968,
            'revenue': 6.5,
            'employees': 30000,
            'market_cap': 8.0,
            'description': 'Provider of semiconductor packaging and test services',
            'supply_chain_stage': 'Packaging/Testing',
            'products': [
                {'name': 'WLGA', 'category': 'Packaging', 'sub_category': 'Advanced Packaging', 'description': 'Wafer level chip scale package'},
                {'name': 'Flip Chip', 'category': 'Packaging', 'sub_category': 'Advanced Packaging', 'description': 'Flip chip packaging services'},
                {'name': 'System in Package', 'category': 'Packaging', 'sub_category': 'SiP', 'description': 'System in package solutions'},
            ]
        },
        {
            'name': 'Intel Products',
            'sector': 'Semiconductors',
            'sub_sector': 'IDM',
            'headquarters': 'Santa Clara, California, USA',
            'founded_year': 1968,
            'revenue': 54.0,
            'employees': 125000,
            'market_cap': 180.0,
            'description': 'Integrated device manufacturer designing and manufacturing microprocessors',
            'supply_chain_stage': 'End Products',
            'products': [
                {'name': 'Intel Core i9', 'category': 'CPU', 'sub_category': 'Desktop', 'description': '14th gen Core processor', 'technology_node': 'Intel 7'},
                {'name': 'Intel Xeon', 'category': 'CPU', 'sub_category': 'Server', 'description': 'Scalable server processor', 'technology_node': 'Intel 7'},
                {'name': 'Intel Arc', 'category': 'GPU', 'sub_category': 'Discrete Graphics', 'description': 'Discrete graphics solutions', 'technology_node': 'TSMC N6'},
            ]
        },
        {
            'name': 'Micron Technology',
            'sector': 'Semiconductors',
            'sub_sector': 'Memory',
            'headquarters': 'Boise, Idaho, USA',
            'founded_year': 1978,
            'revenue': 15.5,
            'employees': 45000,
            'market_cap': 120.0,
            'description': 'Leading memory and storage solutions provider',
            'supply_chain_stage': 'Manufacturing',
            'products': [
                {'name': 'DDR5 DRAM', 'category': 'Memory', 'sub_category': 'DRAM', 'description': 'DDR5 memory modules', 'technology_node': '1-beta'},
                {'name': 'HBM3', 'category': 'Memory', 'sub_category': 'High Bandwidth', 'description': 'High bandwidth memory for AI', 'technology_node': '1-beta'},
                {'name': 'NAND Flash', 'category': 'Storage', 'sub_category': 'NAND', 'description': 'NAND flash memory', 'technology_node': '232-layer'},
            ]
        },
        {
            'name': 'SK Hynix',
            'sector': 'Semiconductors',
            'sub_sector': 'Memory',
            'headquarters': 'Icheon, South Korea',
            'founded_year': 1983,
            'revenue': 16.0,
            'employees': 28000,
            'market_cap': 95.0,
            'description': 'South Korean memory semiconductor supplier',
            'supply_chain_stage': 'Manufacturing',
            'products': [
                {'name': 'HBM3E', 'category': 'Memory', 'sub_category': 'High Bandwidth', 'description': 'HBM3E for AI accelerators', 'technology_node': '1-beta'},
                {'name': 'DDR5', 'category': 'Memory', 'sub_category': 'DRAM', 'description': 'DDR5 DRAM chips', 'technology_node': '1-beta'},
                {'name': 'NAND Flash', 'category': 'Storage', 'sub_category': 'NAND', 'description': '3D NAND flash memory', 'technology_node': '176-layer'},
            ]
        },

        # End Products
        {
            'name': 'Apple',
            'sector': 'Electronics',
            'sub_sector': 'Consumer Electronics',
            'headquarters': 'Cupertino, California, USA',
            'founded_year': 1976,
            'revenue': 383.0,
            'employees': 164000,
            'market_cap': 3000.0,
            'description': 'Consumer electronics company using custom chips in its products',
            'supply_chain_stage': 'End Products',
            'products': [
                {'name': 'iPhone 15 Pro', 'category': 'Smartphone', 'sub_category': 'Flagship', 'description': 'A17 Pro chip smartphone'},
                {'name': 'MacBook Pro', 'category': 'Computer', 'sub_category': 'Laptop', 'description': 'M3 Pro/Max chip laptops'},
                {'name': 'Apple Vision Pro', 'category': 'AR/VR', 'sub_category': 'Spatial Computing', 'description': 'Spatial computing headset'},
            ]
        },
        {
            'name': 'Tesla',
            'sector': 'Automotive',
            'sub_sector': 'Electric Vehicles',
            'headquarters': 'Austin, Texas, USA',
            'founded_year': 2003,
            'revenue': 96.0,
            'employees': 140000,
            'market_cap': 800.0,
            'description': 'Electric vehicle and clean energy company with custom FSD chips',
            'supply_chain_stage': 'End Products',
            'products': [
                {'name': 'FSD Chip', 'category': 'Automotive SoC', 'sub_category': 'Autonomous Driving', 'description': 'Full self-driving processor', 'technology_node': '14nm'},
                {'name': 'Dojo D1', 'category': 'AI Chip', 'sub_category': 'Training', 'description': 'AI training chip for autonomous driving', 'technology_node': '7nm'},
            ]
        },
        {
            'name': 'Google',
            'sector': 'Technology',
            'sub_sector': 'Cloud/AI',
            'headquarters': 'Mountain View, California, USA',
            'founded_year': 1998,
            'revenue': 310.0,
            'employees': 182000,
            'market_cap': 2000.0,
            'description': 'Technology company developing custom AI accelerators',
            'supply_chain_stage': 'End Products',
            'products': [
                {'name': 'TPU v5', 'category': 'AI Accelerator', 'sub_category': 'Cloud AI', 'description': 'Tensor Processing Unit v5', 'technology_node': '4nm'},
                {'name': 'Pixel 8 Pro', 'category': 'Smartphone', 'sub_category': 'Flagship', 'description': 'Tensor G3 chip smartphone'},
            ]
        },
    ]

    # Create companies and products
    companies_map = {}
    for company_data in companies_data:
        products_data = company_data.pop('products')

        company = Company(**company_data)
        db.session.add(company)
        db.session.flush()
        companies_map[company.name] = company.id

        for product_data in products_data:
            product = Product(company_id=company.id, **product_data)
            db.session.add(product)

    db.session.commit()

    # Relationships data
    relationships_data = [
        # EDA -> Design (SUPPLIES)
        {'source': 'Synopsys', 'target': 'NVIDIA', 'type': 'SUPPLIES', 'strength': 9, 'description': 'EDA tools for GPU design'},
        {'source': 'Synopsys', 'target': 'AMD', 'type': 'SUPPLIES', 'strength': 9, 'description': 'EDA tools for CPU/GPU design'},
        {'source': 'Synopsys', 'target': 'Qualcomm', 'type': 'SUPPLIES', 'strength': 8, 'description': 'EDA tools for mobile SoC design'},
        {'source': 'Cadence Design Systems', 'target': 'NVIDIA', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Design tools for GPU architecture'},
        {'source': 'Cadence Design Systems', 'target': 'Apple', 'type': 'SUPPLIES', 'strength': 7, 'description': 'Custom chip design tools'},
        {'source': 'Siemens EDA', 'target': 'Intel', 'type': 'SUPPLIES', 'strength': 7, 'description': 'Verification tools'},
        {'source': 'Siemens EDA', 'target': 'Qualcomm', 'type': 'SUPPLIES', 'strength': 6, 'description': 'Automotive chip design tools'},

        # Design -> Manufacturing (SUPPLIES)
        {'source': 'NVIDIA', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 10, 'description': 'GPU manufacturing partnership'},
        {'source': 'AMD', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 9, 'description': 'CPU/GPU manufacturing'},
        {'source': 'Apple', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 10, 'description': 'A-series and M-series chip manufacturing'},
        {'source': 'Qualcomm', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 9, 'description': 'Snapdragon SoC manufacturing'},
        {'source': 'Qualcomm', 'target': 'Samsung', 'type': 'SUPPLIES', 'strength': 6, 'description': 'Some Snapdragon chips at Samsung'},
        {'source': 'Broadcom', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Network ASIC manufacturing'},
        {'source': 'Marvell Technology', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Network processor manufacturing'},
        {'source': 'Google', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 8, 'description': 'TPU manufacturing'},
        {'source': 'Tesla', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 7, 'description': 'FSD and Dojo chip manufacturing'},

        # Intel manufacturing
        {'source': 'Intel Products', 'target': 'Intel Foundry Services', 'type': 'SUPPLIES', 'strength': 10, 'description': 'Internal manufacturing services'},

        # Manufacturing <-> Equipment (SUPPLIES)
        {'source': 'ASML', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 10, 'description': 'EUV lithography systems'},
        {'source': 'ASML', 'target': 'Samsung', 'type': 'SUPPLIES', 'strength': 9, 'description': 'EUV lithography systems'},
        {'source': 'ASML', 'target': 'Intel', 'type': 'SUPPLIES', 'strength': 9, 'description': 'EUV lithography systems'},
        {'source': 'Applied Materials', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 9, 'description': 'Deposition and etch equipment'},
        {'source': 'Applied Materials', 'target': 'Samsung', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Process equipment'},
        {'source': 'Applied Materials', 'target': 'Intel', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Manufacturing equipment'},
        {'source': 'Lam Research', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 9, 'description': 'Etch equipment'},
        {'source': 'Lam Research', 'target': 'Samsung', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Etch solutions'},
        {'source': 'Lam Research', 'target': 'Intel', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Wet and dry etch equipment'},
        {'source': 'KLA Corporation', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 9, 'description': 'Inspection systems'},
        {'source': 'Tokyo Electron', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Track and etch equipment'},
        {'source': 'Tokyo Electron', 'target': 'Samsung', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Process equipment'},

        # Materials <-> Manufacturing (SUPPLIES)
        {'source': 'Shin-Etsu Chemical', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 9, 'description': 'Silicon wafers'},
        {'source': 'Shin-Etsu Chemical', 'target': 'Samsung', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Silicon wafers and materials'},
        {'source': 'Shin-Etsu Chemical', 'target': 'Intel', 'type': 'SUPPLIES', 'strength': 7, 'description': 'Silicon materials'},
        {'source': 'Air Products', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Industrial gases'},
        {'source': 'Air Products', 'target': 'Samsung', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Specialty gases'},
        {'source': 'Linde', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Electronic gases'},
        {'source': 'Linde', 'target': 'Intel', 'type': 'SUPPLIES', 'strength': 7, 'description': 'Bulk and specialty gases'},
        {'source': 'JSR Corporation', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Photoresist materials'},
        {'source': 'JSR Corporation', 'target': 'Samsung', 'type': 'SUPPLIES', 'strength': 8, 'description': 'EUV photoresist'},

        # Packaging/Testing
        {'source': 'TSMC', 'target': 'ASE Technology', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Advanced packaging services'},
        {'source': 'Samsung', 'target': 'ASE Technology', 'type': 'SUPPLIES', 'strength': 7, 'description': 'Packaging services'},
        {'source': 'AMD', 'target': 'ASE Technology', 'type': 'SUPPLIES', 'strength': 8, 'description': 'CPU/GPU packaging and test'},
        {'source': 'NVIDIA', 'target': 'ASE Technology', 'type': 'SUPPLIES', 'strength': 8, 'description': 'GPU packaging services'},
        {'source': 'Qualcomm', 'target': 'Amkor Technology', 'type': 'SUPPLIES', 'strength': 7, 'description': 'Packaging services'},
        {'source': 'Apple', 'target': 'ASE Technology', 'type': 'SUPPLIES', 'strength': 7, 'description': 'Chip packaging services'},

        # Memory companies
        {'source': 'Micron Technology', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 7, 'description': 'HBM memory for AI chips'},
        {'source': 'Micron Technology', 'target': 'Samsung', 'type': 'SUPPLIES', 'strength': 8, 'description': 'Memory supply'},
        {'source': 'SK Hynix', 'target': 'TSMC', 'type': 'SUPPLIES', 'strength': 8, 'description': 'HBM3E for AI accelerators'},
        {'source': 'SK Hynix', 'target': 'NVIDIA', 'type': 'SUPPLIES', 'strength': 9, 'description': 'HBM3 memory for H100/H200 GPUs'},

        # End Products <-> Design (USES)
        {'source': 'Apple', 'target': 'NVIDIA', 'type': 'USES', 'strength': 6, 'description': 'Discrete GPUs in some products'},
        {'source': 'Tesla', 'target': 'NVIDIA', 'type': 'USES', 'strength': 7, 'description': 'GPU computing for AI training'},

        # Competitive relationships
        {'source': 'NVIDIA', 'target': 'AMD', 'type': 'COMPETES', 'strength': 9, 'description': 'GPU market competition'},
        {'source': 'NVIDIA', 'target': 'Intel', 'type': 'COMPETES', 'strength': 7, 'description': 'Data center GPU competition'},
        {'source': 'AMD', 'target': 'Intel', 'type': 'COMPETES', 'strength': 9, 'description': 'CPU market competition'},
        {'source': 'TSMC', 'target': 'Samsung', 'type': 'COMPETES', 'strength': 9, 'description': 'Foundry market competition'},
        {'source': 'TSMC', 'target': 'Intel Foundry Services', 'type': 'COMPETES', 'strength': 7, 'description': 'Advanced foundry competition'},
        {'source': 'ASML', 'target': 'Canon', 'type': 'COMPETES', 'strength': 8, 'description': 'Lithography equipment competition'},
        {'source': 'ASML', 'target': 'Nikon', 'type': 'COMPETES', 'strength': 8, 'description': 'Lithography systems competition'},
        {'source': 'Applied Materials', 'target': 'Lam Research', 'type': 'COMPETES', 'strength': 8, 'description': 'Process equipment competition'},
        {'source': 'Qualcomm', 'target': 'MediaTek', 'type': 'COMPETES', 'strength': 8, 'description': 'Mobile SoC competition'},
        {'source': 'Apple', 'target': 'Samsung', 'type': 'COMPETES', 'strength': 7, 'description': 'Smartphone market competition'},

        # Investments and partnerships
        {'source': 'Intel', 'target': 'ASML', 'type': 'INVESTS', 'strength': 8, 'description': 'EUV technology development investment'},
        {'source': 'TSMC', 'target': 'JSR Corporation', 'type': 'INVESTS', 'strength': 6, 'description': 'Japanese materials partnership'},
        {'source': 'Apple', 'target': 'Broadcom', 'type': 'PARTNERS', 'strength': 9, 'description': 'Long-term 5G component partnership'},

        # Acquisitions
        {'source': 'AMD', 'target': 'Xilinx', 'type': 'ACQUIRES', 'strength': 10, 'description': 'Acquired in 2022 for $35B'},
        {'source': 'AMD', 'target': 'Pensando', 'type': 'ACQUIRES', 'strength': 8, 'description': 'DPU technology acquisition'},
        {'source': 'Broadcom', 'target': 'VMware', 'type': 'ACQUIRES', 'strength': 10, 'description': 'Acquired in 2023 for $61B'},
        {'source': 'Qualcomm', 'target': 'NXP', 'type': 'ACQUIRES', 'strength': 7, 'description': 'Attempted acquisition in 2018'},
    ]

    for rel_data in relationships_data:
        relationship = Relationship(
            source_id=companies_map.get(rel_data['source']),
            target_id=companies_map.get(rel_data['target']),
            relationship_type=rel_data['type'],
            strength=rel_data.get('strength', 5),
            description=rel_data.get('description'),
            start_date=date(2020, 1, 1)
        )
        db.session.add(relationship)

    db.session.commit()
    print(f"Seeded {len(companies_data)} companies, {len(relationships_data)} relationships")


if __name__ == '__main__':
    from app import create_app, db
    app = create_app()
    with app.app_context():
        seed_semiconductor_industry()
