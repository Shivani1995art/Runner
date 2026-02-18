import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Mail, Phone, Search } from 'lucide-react-native'
import { ms } from '../../utils/responsive'
import CustomHeader from '../../components/common/CustomHeader'
import CustomButton from '../../components/Buttons/CustomButton'
import BackButtonsvg from '../../assets/svg/BackButtonsvg'
import { commonStyle } from '../../styles/CommonStyles'
import Colors from '../../utils/colors'


interface FAQ {
    id: number
    question: string
    answer: string
}

const HelpScreen = ({ navigation }: any) => {
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const faqs: FAQ[] = [
        {
            id: 1,
            question: "How do I accept a delivery order?",
            answer: "When a new order is assigned to you, you'll receive a notification. Open the app to view the order details and tap 'Accept' to confirm. You have a limited time to accept before the order is reassigned."
        },
        {
            id: 2,
            question: "What should I do if I can't find the pickup location?",
            answer: "Use the in-app map for navigation. If you're still unable to find it, tap 'Contact Restaurant' on the order screen to call them directly. You can also contact customer support for assistance."
        },
        {
            id: 3,
            question: "How do I mark an order as picked up?",
            answer: "Once you've collected the order from the restaurant, tap the 'Picked Up' button on the active order screen. This notifies the customer that their order is on the way and starts the delivery timer."
        },
        {
            id: 4,
            question: "What if the customer is not available at delivery?",
            answer: "Attempt to contact the customer via the in-app call option. If unreachable, wait for the specified time shown on your screen. Follow the instructions provided (leave at door, return to restaurant, etc.) and mark accordingly in the app."
        },
        {
            id: 5,
            question: "How and when do I get paid?",
            answer: "Earnings are calculated per delivery and credited to your wallet after each completed drop-off. Payouts are processed weekly every Monday. You can view your earnings breakdown anytime in the 'Earnings' section of the app."
        },
        {
            id: 6,
            question: "How do I go online or offline?",
            answer: "Use the toggle on the home screen to switch between Online and Offline mode. You'll only receive orders when you're Online. Make sure your location permissions are enabled for the app to work correctly."
        },
        {
            id: 7,
            question: "What do I do if there's an issue with an order (missing items, wrong order)?",
            answer: "Do not modify or open sealed packages. If you notice an obvious issue at pickup, inform the restaurant immediately. Tap 'Report Issue' on the order screen and select the relevant reason. Our team will handle the resolution with the customer."
        },
        // {
        //     id: 8,
        //     question: "How do I update my vehicle or document details?",
        //     answer: "Go to Profile > Documents to upload or update your vehicle registration, license, or insurance. Changes are reviewed within 24–48 hours. You may be temporarily restricted from taking orders during verification."
        // }
    ]

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const toggleFaq = (id: number) => {
        setExpandedId(expandedId === id ? null : id)
    }

    const handleContactSupport = () => {
        Linking.openURL('mailto:runner.support@yourapp.com')
    }

    const handleCall = () => {
        Linking.openURL('tel:1800-123-4567')
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <CustomHeader
                    leftComponent={
                        <CustomButton
                            onPress={() => navigation.goBack()}
                            icon={<BackButtonsvg fill="black" props={{}} />}
                            style={[commonStyle.TopbackButtonStyle, { backgroundColor: Colors.aquablue }]}
                        />
                    }
                    title='Help & Support'
                />

                <View style={styles.searchContainer}>
                    <Search size={ms(24)} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for help..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActionsContainer}>
                    <Text style={styles.quickActionsTitle}>Get in touch</Text>
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                            <View style={styles.iconCircle}>
                                <Phone size={ms(24)} />
                            </View>
                            <Text style={styles.actionText}>Call Support</Text>
                            <Text style={styles.actionSubtext}>1800-123-4567</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={handleContactSupport}>
                            <View style={styles.iconCircle}>
                                <Mail size={ms(24)} />
                            </View>
                            <Text style={styles.actionText}>Email Us</Text>
                            <Text style={styles.actionSubtext}>Quick response</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* FAQs Section */}
                <View style={styles.faqSection}>
                    <Text style={styles.sectionTitle}>FAQs</Text>
                    {filteredFaqs.length === 0 ? (
                        <View style={styles.noResultsContainer}>
                            <Text style={styles.noResultsEmoji}>🔍</Text>
                            <Text style={styles.noResults}>No results found</Text>
                            <Text style={styles.noResultsSubtext}>Try searching with different keywords</Text>
                        </View>
                    ) : (
                        filteredFaqs.map((faq) => (
                            <TouchableOpacity
                                key={faq.id}
                                style={[styles.faqItem, expandedId === faq.id && styles.faqItemExpanded]}
                                onPress={() => toggleFaq(faq.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.faqHeader}>
                                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                                    <View style={[styles.faqIconContainer, expandedId === faq.id && styles.faqIconContainerExpanded]}>
                                        <Text style={styles.faqIcon}>
                                            {expandedId === faq.id ? '−' : '+'}
                                        </Text>
                                    </View>
                                </View>
                                {expandedId === faq.id && (
                                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                                )}
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                <View style={styles.contactCard}>
                    <View style={styles.contactHeader}>
                        <Text style={styles.contactEmoji}>🛵</Text>
                        <Text style={styles.contactTitle}>Still need help?</Text>
                    </View>
                    <Text style={styles.contactDescription}>
                        Our runner support team is available 7 days a week to help you with deliveries, payments, and account issues.
                    </Text>
                    <View style={styles.contactDetails}>
                        <View style={styles.contactRow}>
                            <Text style={styles.contactLabel}>📧 Email:</Text>
                            <Text style={styles.contactValue}>runner.support@yourapp.com</Text>
                        </View>
                        <View style={styles.contactRow}>
                            <Text style={styles.contactLabel}>📞 Phone:</Text>
                            <Text style={styles.contactValue}>1800-123-4567 (Toll Free)</Text>
                        </View>
                        <View style={styles.contactRow}>
                            <Text style={styles.contactLabel}>🕐 Hours:</Text>
                            <Text style={styles.contactValue}>8:00 AM – 10:00 PM, Daily</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    )
}

export default HelpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1C1C1C',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#686B78',
        fontWeight: '400',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        marginHorizontal: 20,
        marginVertical: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1C1C1C',
    },
    quickActionsContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    quickActionsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1C',
        marginBottom: 16,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFF4F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionIcon: {
        fontSize: 28,
    },
    actionText: {
        fontSize: 15,
        color: '#1C1C1C',
        fontWeight: '600',
        marginBottom: 4,
    },
    actionSubtext: {
        fontSize: 12,
        color: '#686B78',
    },
    faqSection: {
        paddingHorizontal: 20,
        marginTop: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1C',
        marginBottom: 16,
    },
    faqItem: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    faqItemExpanded: {
        shadowOpacity: 0.08,
        elevation: 3,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C1C1C',
        flex: 1,
        paddingRight: 12,
        lineHeight: 22,
    },
    faqIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    faqIconContainerExpanded: {
        // backgroundColor: '#E23744',
    },
    faqIcon: {
        fontSize: 18,
        color: '#686B78',
        fontWeight: '600',
    },
    faqAnswer: {
        fontSize: 14,
        color: '#686B78',
        marginTop: 14,
        lineHeight: 22,
        paddingRight: 10,
    },
    noResultsContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noResultsEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    noResults: {
        textAlign: 'center',
        color: '#1C1C1C',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },
    noResultsSubtext: {
        textAlign: 'center',
        color: '#686B78',
        fontSize: 14,
    },
    contactCard: {
        backgroundColor: '#FFF9F5',
        margin: 20,
        marginTop: 30,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FFE8DB',
    },
    contactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    contactEmoji: {
        fontSize: 24,
        marginRight: 10,
    },
    contactTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1C',
    },
    contactDescription: {
        fontSize: 14,
        color: '#686B78',
        lineHeight: 20,
        marginBottom: 16,
    },
    contactDetails: {
        gap: 10,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactLabel: {
        fontSize: 14,
        color: '#1C1C1C',
        fontWeight: '600',
        marginRight: 8,
        minWidth: 70,
    },
    contactValue: {
        fontSize: 14,
        color: '#686B78',
        flex: 1,
    },
    bottomPadding: {
        height: 20,
    },
})