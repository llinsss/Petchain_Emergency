// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PetChain Smart Contract
 * @dev Manages pet profiles, medical records, and emergency access with proper access control
 * @notice This contract stores pet data on-chain with owner-controlled privacy settings
 */
contract PetChain {
    // Events for tracking contract interactions
    event PetRegistered(uint256 indexed petId, address indexed owner, string name);
    event ProfileUpdated(uint256 indexed petId, address indexed updater);
    event EmergencyAccess(uint256 indexed petId, address indexed accessor);
    event MedicalDataToggled(uint256 indexed petId, bool isPublic);
    event GoalAdded(uint256 indexed petId, uint256 goalId, string description);
    event HabitLogged(uint256 indexed petId, uint256 habitId, uint256 timestamp);
    event ReflectionAdded(uint256 indexed petId, uint256 reflectionId, uint8 mood);

    // Structs for organizing pet data
    struct PetProfile {
        string name;
        string breed;
        uint8 age;
        string photoHash; // IPFS hash for pet photo
        address owner;
        bool exists;
        bool medicalDataPublic;
        string emergencyContact;
        string emergencyMessage;
        uint256 createdAt;
    }

    struct Goal {
        string description;
        string category; // "health", "behavior", "training"
        bool completed;
        uint256 targetDate;
        uint256 createdAt;
    }

    struct Habit {
        string description;
        string category; // "medication", "exercise", "feeding"
        uint256 timestamp;
        string notes;
        bool verified; // For vet-verified entries
    }

    struct Reflection {
        string content;
        uint8 mood; // 1-5 scale (Sad to Excited)
        string photoHash; // Optional photo IPFS hash
        uint256 timestamp;
    }

    struct MedicalData {
        string allergies;
        string medications;
        string conditions;
        string vetContact;
        string lastCheckup;
        bool isPublic;
    }

    // State variables
    uint256 private _petIdCounter;
    mapping(uint256 => PetProfile) public pets;
    mapping(uint256 => MedicalData) public medicalRecords;
    mapping(uint256 => Goal[]) public petGoals;
    mapping(uint256 => Habit[]) public petHabits;
    mapping(uint256 => Reflection[]) public petReflections;
    mapping(address => uint256[]) public ownerPets;
    mapping(uint256 => uint256) public petAccessCount; // Track QR scans

    // Modifiers for access control
    modifier onlyPetOwner(uint256 petId) {
        require(pets[petId].exists, "Pet does not exist");
        require(pets[petId].owner == msg.sender, "Not the pet owner");
        _;
    }

    modifier petExists(uint256 petId) {
        require(pets[petId].exists, "Pet does not exist");
        _;
    }

    /**
     * @dev Register a new pet profile
     * @param name Pet's name
     * @param breed Pet's breed
     * @param age Pet's age
     * @param photoHash IPFS hash of pet's photo
     * @param emergencyContact Emergency contact information
     * @param emergencyMessage Message for emergency situations
     */
    function registerPet(
        string memory name,
        string memory breed,
        uint8 age,
        string memory photoHash,
        string memory emergencyContact,
        string memory emergencyMessage
    ) external returns (uint256) {
        _petIdCounter++;
        uint256 petId = _petIdCounter;

        pets[petId] = PetProfile({
            name: name,
            breed: breed,
            age: age,
            photoHash: photoHash,
            owner: msg.sender,
            exists: true,
            medicalDataPublic: false,
            emergencyContact: emergencyContact,
            emergencyMessage: emergencyMessage,
            createdAt: block.timestamp
        });

        ownerPets[msg.sender].push(petId);

        emit PetRegistered(petId, msg.sender, name);
        return petId;
    }

    /**
     * @dev Update pet's public profile information
     * @param petId Pet's unique identifier
     * @param emergencyContact Updated emergency contact
     * @param emergencyMessage Updated emergency message
     */
    function updatePublicProfile(
        uint256 petId,
        string memory emergencyContact,
        string memory emergencyMessage
    ) external onlyPetOwner(petId) {
        pets[petId].emergencyContact = emergencyContact;
        pets[petId].emergencyMessage = emergencyMessage;

        emit ProfileUpdated(petId, msg.sender);
    }

    /**
     * @dev Update pet's medical data
     * @param petId Pet's unique identifier
     * @param allergies Pet's allergies
     * @param medications Current medications
     * @param conditions Medical conditions
     * @param vetContact Veterinarian contact info
     * @param lastCheckup Date of last checkup
     */
    function updateMedicalData(
        uint256 petId,
        string memory allergies,
        string memory medications,
        string memory conditions,
        string memory vetContact,
        string memory lastCheckup
    ) external onlyPetOwner(petId) {
        medicalRecords[petId] = MedicalData({
            allergies: allergies,
            medications: medications,
            conditions: conditions,
            vetContact: vetContact,
            lastCheckup: lastCheckup,
            isPublic: medicalRecords[petId].isPublic
        });

        emit ProfileUpdated(petId, msg.sender);
    }

    /**
     * @dev Toggle medical data visibility for emergency access
     * @param petId Pet's unique identifier
     * @param isPublic Whether medical data should be publicly accessible
     */
    function toggleMedicalDataVisibility(uint256 petId, bool isPublic) 
        external 
        onlyPetOwner(petId) 
    {
        pets[petId].medicalDataPublic = isPublic;
        medicalRecords[petId].isPublic = isPublic;

        emit MedicalDataToggled(petId, isPublic);
    }

    /**
     * @dev Add a new goal for the pet
     * @param petId Pet's unique identifier
     * @param description Goal description
     * @param category Goal category
     * @param targetDate Target completion date
     */
    function addGoal(
        uint256 petId,
        string memory description,
        string memory category,
        uint256 targetDate
    ) external onlyPetOwner(petId) {
        petGoals[petId].push(Goal({
            description: description,
            category: category,
            completed: false,
            targetDate: targetDate,
            createdAt: block.timestamp
        }));

        emit GoalAdded(petId, petGoals[petId].length - 1, description);
    }

    /**
     * @dev Log a habit entry for the pet
     * @param petId Pet's unique identifier
     * @param description Habit description
     * @param category Habit category
     * @param notes Additional notes
     */
    function logHabit(
        uint256 petId,
        string memory description,
        string memory category,
        string memory notes
    ) external onlyPetOwner(petId) {
        petHabits[petId].push(Habit({
            description: description,
            category: category,
            timestamp: block.timestamp,
            notes: notes,
            verified: false
        }));

        emit HabitLogged(petId, petHabits[petId].length - 1, block.timestamp);
    }

    /**
     * @dev Add a reflection entry for the pet
     * @param petId Pet's unique identifier
     * @param content Reflection content
     * @param mood Mood rating (1-5)
     * @param photoHash Optional photo IPFS hash
     */
    function addReflection(
        uint256 petId,
        string memory content,
        uint8 mood,
        string memory photoHash
    ) external onlyPetOwner(petId) {
        require(mood >= 1 && mood <= 5, "Mood must be between 1 and 5");

        petReflections[petId].push(Reflection({
            content: content,
            mood: mood,
            photoHash: photoHash,
            timestamp: block.timestamp
        }));

        emit ReflectionAdded(petId, petReflections[petId].length - 1, mood);
    }

    /**
     * @dev Get public pet information (accessible via QR scan)
     * @param petId Pet's unique identifier
     * @return Pet's public profile data
     */
    function getPublicPetInfo(uint256 petId) 
        external 
        petExists(petId) 
        returns (
            string memory name,
            string memory breed,
            uint8 age,
            string memory photoHash,
            string memory emergencyContact,
            string memory emergencyMessage,
            bool medicalDataPublic
        ) 
    {
        PetProfile memory pet = pets[petId];
        
        // Track access for owner notifications
        petAccessCount[petId]++;
        emit EmergencyAccess(petId, msg.sender);

        return (
            pet.name,
            pet.breed,
            pet.age,
            pet.photoHash,
            pet.emergencyContact,
            pet.emergencyMessage,
            pet.medicalDataPublic
        );
    }

    /**
     * @dev Get medical data if public or if owner
     * @param petId Pet's unique identifier
     * @return Medical data if accessible
     */
    function getMedicalData(uint256 petId) 
        external 
        view 
        petExists(petId) 
        returns (
            string memory allergies,
            string memory medications,
            string memory conditions,
            string memory vetContact,
            string memory lastCheckup
        ) 
    {
        require(
            pets[petId].medicalDataPublic || pets[petId].owner == msg.sender,
            "Medical data not accessible"
        );

        MedicalData memory medical = medicalRecords[petId];
        return (
            medical.allergies,
            medical.medications,
            medical.conditions,
            medical.vetContact,
            medical.lastCheckup
        );
    }

    /**
     * @dev Get pet's goals (owner only)
     * @param petId Pet's unique identifier
     * @return Array of goals
     */
    function getPetGoals(uint256 petId) 
        external 
        view 
        onlyPetOwner(petId) 
        returns (Goal[] memory) 
    {
        return petGoals[petId];
    }

    /**
     * @dev Get pet's habits (owner only)
     * @param petId Pet's unique identifier
     * @return Array of habits
     */
    function getPetHabits(uint256 petId) 
        external 
        view 
        onlyPetOwner(petId) 
        returns (Habit[] memory) 
    {
        return petHabits[petId];
    }

    /**
     * @dev Get pet's reflections (owner only)
     * @param petId Pet's unique identifier
     * @return Array of reflections
     */
    function getPetReflections(uint256 petId) 
        external 
        view 
        onlyPetOwner(petId) 
        returns (Reflection[] memory) 
    {
        return petReflections[petId];
    }

    /**
     * @dev Get all pets owned by an address
     * @param owner Owner's address
     * @return Array of pet IDs
     */
    function getOwnerPets(address owner) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return ownerPets[owner];
    }

    /**
     * @dev Get QR scan count for a pet (owner only)
     * @param petId Pet's unique identifier
     * @return Number of times QR was scanned
     */
    function getPetAccessCount(uint256 petId) 
        external 
        view 
        onlyPetOwner(petId) 
        returns (uint256) 
    {
        return petAccessCount[petId];
    }
}
