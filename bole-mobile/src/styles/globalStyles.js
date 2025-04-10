import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  // Color Palette
  primaryColor: "#2E9AFE", // A vibrant blue
  secondaryColor: "#58D68D", // A fresh green
  backgroundColor: "#F5F5F5", // Light grey background
  textColor: "#333333", // Dark grey text
  lightTextColor: "#666666", // Lighter grey text
  white: "#FFFFFF",
  borderColor: "#CCCCCC", // Light grey border
  disabledColor: "#999999", // Grey for disabled elements
  errorColor: "#E74C3C", // Red for errors
  secondaryBackgroundColor: "#FAFAFA", // Very light grey for secondary backgrounds
  tertiaryBackgroundColor: "#EEEEEE", // Even lighter grey
  errorBackground: "#FCE4E4", // Light red for error backgrounds
  secondaryTextColor: "#757575", // Medium grey text
  tertiaryTextColor: "#9E9E9E", // Light grey text

  // Global shadow style
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // for Android
  },
  
  // Container
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },

  // Text Styles
  text: {
    fontSize: 16,
    color: "#333333", // Default text color
    // Uses system default font
  },
  smallText: {
    fontSize: 15,
    color: "#666666", // Text color for small text
    // Uses system default font
  },
  
  // Titles
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333333", // Text color for header titles
    // Uses system default font
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333", // Text color for regular titles
    // Uses system default font
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666666", // Text color for subtitles
    // Uses system default font
  },
  
  // Input Fields
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FFFFFF", // Background color for input fields
    fontSize: 16,
    color: "#333333",
    // Uses system default font
    ...StyleSheet.shadow,
  },

  // Buttons
  button: {
    backgroundColor: "#2E9AFE",
    padding: 12,
    borderRadius: 12,
    alignItems: "center", // Center button text horizontally
    ...StyleSheet.shadow,
  },
  secondaryButton: {
    backgroundColor: "#58D68D",
    padding: 12, 
    borderRadius: 12,
    alignItems: "center",
    ...StyleSheet.shadow,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    // Uses system default font
  },
  
  // Links
  linkText: {
    color: "#2E9AFE",
    fontSize: 16,
    // Uses system default font
  },
  
  // Error Text
  errorText: {
    color: "#E74C3C",
    fontSize: 15,
    // Uses system default font
  },
  
  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    // Applies global shadow style
    ...StyleSheet.shadow,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF", // Background color for card container
    borderRadius: 12,
    padding: 16,
  },
  
  // Floating Action Button (FAB)
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#2E9AFE",
    borderRadius: 28,
    width: 56, 
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    ...StyleSheet.shadow,
  },
  
  // Chip
  chip: {
    backgroundColor: "#E0F7FA", // Example: Light blue background for chips
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
  }, 
  
  // Avatar
  avatar: {
    width: 40, 
    height: 40,
    borderRadius: 20,
    backgroundColor: "#B2EBF2", // Light teal
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { 
    fontSize: 18,
    color: "#FFFFFF",
    // Uses system default font
  },
  
  // Badge
  badge: {
    backgroundColor: "#F06292", // Pink
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  }, 
  badgeText: {
    fontSize: 12,
    color: "#FFFFFF",
    // Uses system default font
  },
});

export default globalStyles;