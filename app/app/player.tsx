import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native"
import { useState, useEffect, useRef } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import Slider from "@react-native-community/slider"
import { useAudio } from "../src/contexts/AudioContext"
import { getReciterPhotoUrl } from "../src/constants/config"
import { isRTL, isArabic } from "../src/services/i18n"
import { getFontFamily } from "../src/utils/fonts"
import SurahName from "../src/components/SurahName"

const { width } = Dimensions.get("window")

// ===========================
// UI CONFIGURATION KNOBS
// ===========================

// Layout & Sizing
const PHOTO_SIZE_RATIO = 0.75 // Percentage of screen width
const PHOTO_SIZE = width * PHOTO_SIZE_RATIO
const PHOTO_BORDER_RADIUS = 16

// Gradient Configuration
const GRADIENT_PRIMARY_OPACITY = 0.8
const GRADIENT_SECONDARY_OPACITY_TOP = 0.3
const GRADIENT_SECONDARY_OPACITY_BOTTOM = 0.0
const GRADIENT_LOCATIONS = [0, 0.2, 0.7, 1] // Color stop positions

// Slider Configuration
const SLIDER_HEIGHT = 60
const SLIDER_TRACK_HEIGHT = 10
const SLIDER_THUMB_SIZE = 16
const SLIDER_PLAYED_COLOR = "#FFFFFF"
const SLIDER_UNPLAYED_OPACITY = 0.3
const SLIDER_TIME_PADDING = 16

// Control Button Sizes
const SIDE_BUTTON_SIZE = 28 // Download & Shuffle
const SKIP_BUTTON_SIZE = 40 // Previous & Next
const PLAY_PAUSE_ICON_SIZE = 54
const PLAY_BUTTON_SIZE = 88

// Spacing & Margins
const SCREEN_HORIZONTAL_PADDING = 5
const ARTWORK_TOP_MARGIN = 75
const ARTWORK_BOTTOM_MARGIN = 5
const INFO_BOTTOM_MARGIN = 5

// Typography & Colors
const SURAH_NAME_SIZE = 42
const RECITER_NAME_SIZE = 18
const TIME_TEXT_SIZE = 12
const RECITER_NAME_OPACITY = 0.7
const TIME_TEXT_OPACITY = 0.6

// ===========================

/**
 * Convert hex color to rgba with opacity
 */
const hexToRgba = (hex: string | null | undefined, alpha: number): string => {
    if (!hex) return `rgba(18, 18, 18, ${alpha})`

    const num = parseInt(hex.replace("#", ""), 16)
    const r = (num >> 16) & 0xff
    const g = (num >> 8) & 0xff
    const b = num & 0xff

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Format seconds to HH:MM:SS or MM:SS
 */
const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`
}

export default function PlayerScreen() {
    const router = useRouter()
    const {
        currentTrack,
        isPlaying,
        position,
        duration,
        playbackMode,
        setPlaybackMode,
        togglePlayPause,
        seekTo,
        playNext,
    } = useAudio()
    const rtl = isRTL()
    const arabic = isArabic()

    // Slider state for smooth seeking
    const [isSliding, setIsSliding] = useState(false)
    const [slidingPosition, setSlidingPosition] = useState(0)
    const seekingToRef = useRef<number | null>(null)

    // Reset seeking state when position catches up
    useEffect(() => {
        if (seekingToRef.current !== null) {
            const diff = Math.abs(position - seekingToRef.current)
            if (diff < 1) {
                // Position has caught up
                seekingToRef.current = null
            }
        }
    }, [position])

    // Use sliding position while sliding or seeking, otherwise use actual position
    const displayPosition =
        isSliding || seekingToRef.current !== null ? slidingPosition : position

    if (!currentTrack) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>No track playing</Text>
                </View>
            </SafeAreaView>
        )
    }

    const primaryColor = currentTrack.reciterColorPrimary || "#282828"
    const secondaryColor = currentTrack.reciterColorSecondary || "#404040"

    return (
        <LinearGradient
            colors={[
                hexToRgba(primaryColor, GRADIENT_PRIMARY_OPACITY),
                hexToRgba(primaryColor, GRADIENT_SECONDARY_OPACITY_TOP),
                hexToRgba(primaryColor, GRADIENT_SECONDARY_OPACITY_BOTTOM),
                "#121212",
            ]}
            locations={GRADIENT_LOCATIONS}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
                {/* Back Button */}
                <TouchableOpacity
                    style={[styles.backButton, rtl && styles.backButtonRTL]}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Share Button */}
                <TouchableOpacity
                    style={[styles.shareButton, rtl && styles.shareButtonRTL]}
                    onPress={() => {
                        // TODO: Implement share functionality
                        console.log("Share")
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="share-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Album Art */}
                <View style={styles.artworkContainer}>
                    <Image
                        source={{
                            uri: getReciterPhotoUrl(currentTrack.reciterId),
                        }}
                        style={styles.artwork}
                        resizeMode="cover"
                    />
                </View>

                {/* Track Info */}
                <View style={styles.infoContainer}>
                    <SurahName
                        surahNumber={currentTrack.surahNumber}
                        fallbackName={currentTrack.surahName}
                        fontSize={SURAH_NAME_SIZE}
                        style={styles.surahName}
                        numberOfLines={1}
                    />
                    <Text
                        style={[
                            styles.reciterName,
                            { fontFamily: getFontFamily(arabic, "medium") },
                        ]}
                        numberOfLines={1}
                    >
                        {currentTrack.reciterName}
                    </Text>
                </View>

                {/* Progress Bar */}
                <View
                    style={[
                        styles.progressContainer,
                        rtl && styles.progressContainerRTL,
                    ]}
                >
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={duration || 1}
                        value={displayPosition}
                        onSlidingStart={() => setIsSliding(true)}
                        onValueChange={(value) => setSlidingPosition(value)}
                        onSlidingComplete={async (value) => {
                            setIsSliding(false)
                            seekingToRef.current = value
                            await seekTo(value)
                        }}
                        minimumTrackTintColor={SLIDER_PLAYED_COLOR}
                        maximumTrackTintColor={`rgba(255, 255, 255, ${SLIDER_UNPLAYED_OPACITY})`}
                        thumbTintColor={SLIDER_PLAYED_COLOR}
                        inverted={rtl}
                        thumbStyle={styles.sliderThumb}
                        trackStyle={styles.sliderTrack}
                    />
                    <View
                        style={[
                            styles.timeContainer,
                            rtl && styles.timeContainerRTL,
                        ]}
                    >
                        <Text style={styles.timeText}>
                            {formatTime(displayPosition)}
                        </Text>
                        <Text style={styles.timeText}>
                            {formatTime(duration)}
                        </Text>
                    </View>

                    {/* Side Controls (Shuffle, Sleep Timer & Download) */}
                    <View style={styles.sideControlsRow}>
                        <TouchableOpacity
                            onPress={() => {
                                setPlaybackMode((prev) =>
                                    prev === "shuffle" ? "repeat" : "shuffle",
                                )
                            }}
                            hitSlop={{
                                top: 15,
                                bottom: 15,
                                left: 15,
                                right: 15,
                            }}
                        >
                            <Ionicons
                                name={
                                    playbackMode === "shuffle"
                                        ? "shuffle"
                                        : "repeat"
                                }
                                size={SIDE_BUTTON_SIZE}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                // TODO: Open sleep timer modal
                                console.log("Sleep Timer")
                            }}
                            hitSlop={{
                                top: 15,
                                bottom: 15,
                                left: 15,
                                right: 15,
                            }}
                        >
                            <Ionicons
                                name="moon-outline"
                                size={SIDE_BUTTON_SIZE}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                // TODO: Download current surah
                                console.log("Download")
                            }}
                            hitSlop={{
                                top: 15,
                                bottom: 15,
                                left: 15,
                                right: 15,
                            }}
                        >
                            <Ionicons
                                name="arrow-down-circle-outline"
                                size={SIDE_BUTTON_SIZE}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Playback Controls */}
                <View
                    style={[
                        styles.mainControlsRow,
                        rtl && styles.mainControlsRowRTL,
                    ]}
                >
                    {/* Next Button (appears on left in LTR, right in RTL) */}
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={async () => {
                            await playNext()
                        }}
                        hitSlop={{
                            top: 15,
                            bottom: 15,
                            left: 15,
                            right: 15,
                        }}
                    >
                        <Ionicons
                            name="play-skip-back"
                            size={SKIP_BUTTON_SIZE}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>

                    {/* Play/Pause Button */}
                    <TouchableOpacity
                        style={styles.playButton}
                        onPress={togglePlayPause}
                        activeOpacity={0.8}
                    >
                        <View
                            style={[
                                !isPlaying && styles.playIconOffset,
                                rtl && styles.playIconFlip,
                            ]}
                        >
                            <Ionicons
                                name={isPlaying ? "pause" : "play"}
                                size={PLAY_PAUSE_ICON_SIZE}
                                color="#121212"
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Previous Button (appears on right in LTR, left in RTL) */}
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={async () => {
                            // Restart current track
                            await seekTo(0)
                        }}
                        hitSlop={{
                            top: 15,
                            bottom: 15,
                            left: 15,
                            right: 15,
                        }}
                    >
                        <Ionicons
                            name="play-skip-forward"
                            size={SKIP_BUTTON_SIZE}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: "#B3B3B3",
        fontSize: 16,
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: 20,
        opacity: 0.7,
    },
    backButtonRTL: {
        left: undefined,
        right: 20,
    },
    shareButton: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: 20,
        opacity: 0.7,
    },
    shareButtonRTL: {
        right: undefined,
        left: 20,
    },
    artworkContainer: {
        alignItems: "center",
        marginTop: ARTWORK_TOP_MARGIN,
        marginBottom: ARTWORK_BOTTOM_MARGIN,
    },
    artwork: {
        width: PHOTO_SIZE,
        height: PHOTO_SIZE,
        borderRadius: PHOTO_BORDER_RADIUS,
        backgroundColor: "#282828",
    },
    infoContainer: {
        alignItems: "center",
        marginBottom: INFO_BOTTOM_MARGIN,
    },
    surahName: {
        fontSize: SURAH_NAME_SIZE,
        color: "#FFFFFF",
        marginBottom: 5,
        textAlign: "center",
    },
    reciterName: {
        fontSize: RECITER_NAME_SIZE,
        color: `rgba(255, 255, 255, ${RECITER_NAME_OPACITY})`,
        textAlign: "center",
    },
    progressContainer: {
        marginBottom: 0,
    },
    progressContainerRTL: {
        transform: [{ scaleX: -1 }],
    },
    slider: {
        width: "100%",
        height: SLIDER_HEIGHT,
    },
    sliderThumb: {
        width: SLIDER_THUMB_SIZE,
        height: SLIDER_THUMB_SIZE,
        borderRadius: SLIDER_THUMB_SIZE / 2,
    },
    sliderTrack: {
        height: SLIDER_TRACK_HEIGHT,
        borderRadius: SLIDER_TRACK_HEIGHT / 2,
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: SLIDER_TIME_PADDING,
        marginTop: -10,
    },
    timeContainerRTL: {
        transform: [{ scaleX: -1 }],
    },
    timeText: {
        fontSize: TIME_TEXT_SIZE,
        color: `rgba(255, 255, 255, ${TIME_TEXT_OPACITY})`,
    },
    sideControlsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
        paddingHorizontal: SLIDER_TIME_PADDING,
    },
    mainControlsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 32,
    },
    mainControlsRowRTL: {
        flexDirection: "row-reverse",
    },
    skipButton: {
        padding: 18,
    },
    playButton: {
        width: PLAY_BUTTON_SIZE,
        height: PLAY_BUTTON_SIZE,
        borderRadius: PLAY_BUTTON_SIZE / 2,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },
    playIconOffset: {
        marginLeft: 6,
    },
    playIconFlip: {
        transform: [{ scaleX: -1 }],
    },
})
