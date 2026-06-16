import Container from "../shared/Container";
import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section
      id="features"
      className="py-28"
    >
      <Container>

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full border bg-white px-5 py-2 text-sm shadow-sm">
            Why FinFlow?
          </span>

          <h2 className="mt-8 text-5xl font-bold tracking-tight">

            Finance that feels
            <br />
            human.

          </h2>

          <p className="mt-6 text-lg text-zinc-600">

            Every feature is designed to reduce money stress,
            celebrate progress,
            and help you build lasting financial habits.

          </p>

        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          <FeatureCard
            emoji="🌟"
            title="Daily Spotlight"
            description="Every day begins with a personalized financial insight instead of overwhelming charts."
          />

          <FeatureCard
            emoji="🎯"
            title="Goal Based Saving"
            description="Track dreams instead of just balances and celebrate every milestone along the way."
          />

          <FeatureCard
            emoji="❤️"
            title="Life Vault"
            description="Turn purchases into memories by attaching photos, stories and milestones to every achievement."
          />

        </div>

      </Container>
    </section>
  );
}