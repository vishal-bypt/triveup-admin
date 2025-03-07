// import theme style scss file
import 'styles/theme.scss';
import { ToastContainer } from "react-toastify";

export const metadata = {
    title: 'Trive Up - Improve your well-being, build a community',
    description: 'TriveUp is a platform designed to enhance User’s well-being by providing Posts, Events, and Community. The platform aims to support Physical, Emotional and Social well-being through various features, including Posts, Articles, Events and interactive Communities.',
    keywords: 'Trive Up, Body & Mind Therapy, Exercising, Healthy Lifestyle, Depression Tips, Wellbeing Tips, Counselling, Yoga, Massage, Mindfulness, Meditation, Hypnotherapy, Cycling, Gymnastics, Swimming, Running, Weight Lifting, Hiking, Walking, Gardening, Healthy Snacking, Balanced Diet, Healthy Eating, Sleep, Sleep Well, Diet Plan, Healthy Meal Plan, Anxiety Triggers, Positive Attitude, Coping with anxiety, Socio Communication, Social Wellbeing, Anxiety, Positive Thoughts, Mental Wellbeing, Social Wellbeing',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className='bg-light'>
                <ToastContainer />
                {children}
            </body>
        </html>
    )
}
