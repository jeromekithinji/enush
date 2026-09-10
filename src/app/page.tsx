import { AboutSection } from '@/components/home/about-section'
import { FinSmartSection } from '@/components/home/finsmart-section'
import { FaqsSection } from '@/components/home/faqs-section'
import { FinalCtaSection } from '@/components/home/final-cta-section'
import { HeroSection } from '@/components/home/hero-section'
import { HowItWorksSection } from '@/components/home/how-it-works-section'
import { OnboardSection } from '@/components/home/onboard-section'
import { LoanCalculatorSection } from '@/components/home/loan-calculator-section'
import { LoanSolutionsSection } from '@/components/home/loan-solutions-section'
import { StatsBar } from '@/components/home/stats-bar'
import { WhyEnushaSection } from '@/components/home/why-enusha-section'

export default function Home () {
	return (
		<>
			<HeroSection />
			<StatsBar />
			<AboutSection />
			<WhyEnushaSection />
			<LoanSolutionsSection />
			<LoanCalculatorSection />
			<FinSmartSection />
			<HowItWorksSection />
			<OnboardSection />
			<FaqsSection />
			<FinalCtaSection />
		</>
	)
}
