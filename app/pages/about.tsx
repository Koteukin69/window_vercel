import { Button, Data } from "@/components";

const text = "Lorea ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget justo nec justo ultrices ultricies. Mauris eget justo nec justo ultrices ultricies.Lorea ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget justo nec justo ultrices ultricies. Mauris eget justo nec justo ultrices ultricies.Lorea ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget justo nec justo ultrices ultricies. Mauris eget justo nec justo ultrices ultricies. "

export default function About() {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <Data data={[
                {
                    type: "bgMusic",
                    src: "/greatest.mp4",
                    width: 200
                },
                {
                    type: "title",
                    text: "О нас"
                },
                {
                    type: "text",
                    text: text
                },
                {
                    type: "text",
                    text: text.repeat(2)
                },
                {
                    type: "title",
                    text: "Подробнее"
                },
                {
                    type: "text",
                    text: text,
                    width: "75%"
                },
                {
                    type: "picture",
                    src: "https://img.freepik.com/free-vector/leadership-reach-business-success-trophy-global-business-companies-corporate-employees-are-always-competing-higher-better-positions-business-concept-goals-success_1150-55454.jpg",
                    width: "75%"
                },
                {
                    type: "text",
                    text: text
                },
                {
                    type: "component",
                    component: <Button text="< Back" type="link" href="/" />,
                    width: 200
                },
            ]} />
        </div>)
}

